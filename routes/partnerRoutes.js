const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protected } = require("../middlewares/auth.middleware");
const {
  createPartner,
  getAllPartners,
  deletePartner,
} = require("../controllers/partnerController");

router.post("/", protected, upload.single("image"), createPartner);

router.get("/", getAllPartners);

router.delete("/:id", protected, deletePartner);

module.exports = router;
