const crypto = require("crypto");
const Otp = require("../models/OtpModel");
const { Op } = require("sequelize");

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const storeOTP = async (email, otp, type) => {
  try {
    // Delete any existing OTP for this email and type
    await Otp.destroy({
      where: {
        email,
        type,
      },
    });

    await Otp.create({
      email,
      otp,
      type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
    });

    return true;
  } catch (error) {
    console.error("Error storing OTP:", error);
    return false;
  }
};

const verifyOTP = async (email, otp, type) => {
  try {
    const otpRecord = await Otp.findOne({
      where: {
        email,
        type,
        isUsed: false,
        expiresAt: {
          [Op.gt]: new Date(), 
        },
      },
    });

    if (!otpRecord) {
      return false;
    }

    if (otpRecord.otp === otp) {
      await otpRecord.update({ isUsed: true });
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
};
