const express = require("express");
const router = express.Router();
const { protected } = require("../middlewares/auth.middleware");
const {
  createPartner,
  getAllPartners,
  deletePartner,
} = require("../controllers/partnerController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/partner");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // اسم فريد
  }
});

const upload = multer({ storage });
router.post("/", protected, upload.single("logo"), createPartner);

router.get("/", getAllPartners);

router.delete("/:id", protected, deletePartner);

module.exports = router;
