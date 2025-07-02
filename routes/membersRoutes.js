const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protected } = require("../middlewares/auth.middleware");
const { getAllMember, createMember, deleteMember } = require("../controllers/MemberController");

router.get('/', getAllMember);
router.post('/add',protected, upload.single('image'), createMember);
router.delete('/:id',protected, deleteMember);

module.exports = router;
