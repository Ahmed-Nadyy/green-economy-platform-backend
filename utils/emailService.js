const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp, type) => {
  const subject = type === "login" ? "Login OTP" : "Account Verification OTP";
  const html = `
    <h1>${subject}</h1>
    <p>Your OTP is: <strong>${otp}</strong></p>
    <p>This OTP will expire in 10 minutes.</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
};
