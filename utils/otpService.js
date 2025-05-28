const crypto = require("crypto");

const otpStore = new Map();

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const storeOTP = (email, otp, type) => {
  const key = `${email}-${type}`;
  otpStore.set(key, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 5 minutes
  });
};

const verifyOTP = (email, otp, type) => {
  const key = `${email}-${type}`;
  const storedData = otpStore.get(key);

  if (!storedData) {
    return false;
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(key);
    return false;
  }

  if (storedData.otp === otp) {
    otpStore.delete(key);
    return true;
  }

  return false;
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
};
