const express = require("express");
const router = express.Router();
const { protected } = require("../middlewares/auth.middleware");
const { getAllMember, createMember, deleteMember } = require("../controllers/MemberController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/members");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // اسم فريد
  }
});

const upload = multer({ storage });
router.get('/', getAllMember);
router.post('/add',protected, upload.single('image'), createMember);
router.delete('/:id',protected, deleteMember);

module.exports = router;
