const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protected } = require("../middlewares/auth.middleware");
const {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  addAdmin,
} = require("../controllers/adminController");

// Configure multer for file upload
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

router.use(protected);

router.get("/", getAllAdmins);
router.post("/", addAdmin);
router.get("/:id", getAdminById);
router.patch("/:id", upload.single("image"), updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;
