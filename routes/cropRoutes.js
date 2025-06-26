const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protected } = require("../middlewares/auth.middleware");

const {
  createCrop,
  updateCrop,
  getCropById,
  getAllCrops,
  deleteCrop,
} = require("../controllers/cropController");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/crop");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images and videos are allowed."));
    }
  }
});

router.post("/", protected, upload.single("image"), createCrop);

router.patch("/:id", protected, upload.single("image"), updateCrop);

router.get("/:id", getCropById);

router.get("/", getAllCrops);

router.delete("/:id", protected, deleteCrop);

module.exports = router;
