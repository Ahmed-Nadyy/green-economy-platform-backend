const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protected } = require("../middlewares/auth.middleware");
const {
  updateMediaItems,
  getMediaItems,
} = require("../controllers/mediaController");

router.patch("/", protected, updateMediaItems);
router.get("/", getMediaItems);

module.exports = router;
