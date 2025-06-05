const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  addAdmin
} = require("../controllers/adminController");

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.get("/", getAllAdmins);
router.post("/", addAdmin);
router.get("/:id", getAdminById);
router.patch("/:id", upload.single("image"), updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;
