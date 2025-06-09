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

const sendOTPEmail = async (email, otp, type, isExpired = false) => {
  const subject = type === "login" ? "Login OTP" : "Account Verification OTP";
  const title = type === "login" ? "Sign in to app" : "Verify your account";
  const description =
    type === "login"
      ? "You requested to sign in to <strong>Green Economy</strong>. Your one-time code is:"
      : "To verify your account on <strong>Green Economy</strong>, please use this one-time code:";

  const html = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f5f6f8; padding: 40px; display: flex; justify-content: center;">
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);  width: 100%; padding: 32px; text-align: center;">
      <div style="font-size: 40px; margin-bottom: 16px;">⚡</div>
      <h2 style="margin-bottom: 8px;">${title}</h2>
      <p style="margin-bottom: 24px;">${description}</p>

      <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 12px; background-color: #f1f3f5; border-radius: 8px; margin-bottom: 16px;">
        ${otp}
      </div>

      ${
        isExpired
          ? `<p style="color: #d93025; font-weight: 500; margin-bottom: 16px;">This code has expired. Please request a new one.</p>`
          : `<p style="color: #555; margin-bottom: 16px;">This code expires in 10 minutes.</p>`
      }

      <p style="color: #888; font-size: 14px;">
        If you didn't request to sign in, you can safely ignore this email.
        Someone else might have typed your email address by mistake.
      </p>
    </div>
  </div>
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
