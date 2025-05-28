const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const Admin = require("../models/AdminModel");
const { generateOTP, storeOTP, verifyOTP } = require("../utils/otpService");
const { sendOTPEmail } = require("../utils/emailService");

const register = async (req, res) => {
  let imagePath = null;
  try {
    const { fullName, email, password, confirmPassword, job, phoneNumber } =
      req.body;
    const imageFile = req.file;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
      });
    }

    const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        message: "Please enter a valid Egyptian phone number",
        details:
          "Phone number should start with +20 or 0 followed by 1, 0, 1, 2, or 5 and 8 digits",
      });
    }

    const formattedPhone = phoneNumber.startsWith("+20")
      ? phoneNumber
      : phoneNumber.startsWith("0")
      ? "+20" + phoneNumber.slice(1)
      : "+20" + phoneNumber;

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (imageFile) {
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${Date.now()}-${imageFile.originalname}`;
      imagePath = path.join(uploadDir, fileName);
      fs.writeFileSync(imagePath, imageFile.buffer);
    }

    const admin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
      job,
      phoneNumber: formattedPhone,
      imageUrl: imagePath ? `/uploads/${path.basename(imagePath)}` : null,
    });
    const otp = generateOTP();
    await storeOTP(email, otp, "register");
    const emailSent = await sendOTPEmail(email, otp, "register");

    if (!emailSent) {
      // If email sending fails, delete the created admin and image
      await admin.destroy();
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      adminId: admin.id,
    });
  } catch (error) {
    // Clean up image if registration fails
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    console.error("Registration error:", error);

    // Handle validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error",
        details: error.errors.map((err) => err.message),
      });
    }

    res.status(500).json({ message: "Registration failed" });
  }
};

// Verify registration OTP
const verifyRegistration = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const isValid = await verifyOTP(email, otp, "register");
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    admin.isVerified = true;
    await admin.save();

    res.json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your account first" });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const otp = generateOTP();
    await storeOTP(email, otp, "login");
    const emailSent = await sendOTPEmail(email, otp, "login");

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    admin.lastLoginAttempt = new Date();
    await admin.save();

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// Verify login OTP
const verifyLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isValid = await verifyOTP(email, otp, "login");
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION_TIME }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        job: admin.job,
        phoneNumber: admin.phoneNumber,
        imageUrl: admin.imageUrl,
      },
    });
  } catch (error) {
    console.error("Login verification error:", error);
    res.status(500).json({ message: "Login verification failed" });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email, type } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const otp = generateOTP();
    await storeOTP(email, otp, type);
    const emailSent = await sendOTPEmail(email, otp, type);

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

module.exports = {
  register,
  verifyRegistration,
  login,
  verifyLogin,
  resendOTP,
};
