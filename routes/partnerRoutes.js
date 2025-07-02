const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protected } = require("../middlewares/auth.middleware");
const {
  createPartner,
  updatePartner,
  getAllPartners,
  getPartnerById,
  deletePartner,
} = require("../controllers/partnerController");

router.post("/", protected, upload.single("image"), createPartner);

router.patch("/:id", protected, upload.single("image"), updatePartner);

router.get("/", getAllPartners);

router.get("/:id", getPartnerById);

router.delete("/:id", protected, deletePartner);

module.exports = router;
