const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  register,
  verifyRegistration,
  login,
  verifyLogin,
  resendOTP,
} = require("../controllers/authController");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post("/register", upload.single("image"), register);
router.post("/verify-account", verifyRegistration);
router.post("/login", login);
router.post("/verify-login", verifyLogin);
router.post("/resend-otp", resendOTP);

module.exports = router;
