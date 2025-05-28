const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const Admin = require("../models/AdminModel");
const { generateOTP, storeOTP, verifyOTP } = require("../utils/otpService");
const { sendOTPEmail } = require("../utils/emailService");

// Register new admin
const register = async (req, res) => {
  try {
    const { fullName, email, password, job, phoneNumber } = req.body;
    const imageFile = req.file;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle image upload
    let imageUrl = null;
    if (imageFile) {
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${Date.now()}-${imageFile.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, imageFile.buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    // Create admin
    const admin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
      job,
      phoneNumber,
      imageUrl,
    });

    // Generate and send OTP
    const otp = generateOTP();
    storeOTP(email, otp, "register");
    await sendOTPEmail(email, otp, "register");

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      adminId: admin.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
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

    const isValid = verifyOTP(email, otp, "register");
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

    // Generate and send OTP
    const otp = generateOTP();
    storeOTP(email, otp, "login");
    await sendOTPEmail(email, otp, "login");

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

    const isValid = verifyOTP(email, otp, "login");
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
    storeOTP(email, otp, type);
    await sendOTPEmail(email, otp, type);

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
