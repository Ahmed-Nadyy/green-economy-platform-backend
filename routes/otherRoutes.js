const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protected } = require("../middlewares/auth.middleware");
const {
  createMediaItems,
  updateMediaItems,
  getMediaItems,

  createBackground,
  updateBackground,
} = require("../controllers/otherController");

router.post("/", protected, createMediaItems);

router.patch("/:id", protected, updatePartner);

router.get("/", getMediaItems);

router.post("/", protected ,upload.single("image"), createBackground);

router.patch("/:id", protected ,upload.single("image"), updateBackground);

module.exports = router;
