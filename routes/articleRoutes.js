const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const {
  createArticle,
  updateArticle,
  getArticlesBySubType,
  getArticleById,
  deleteArticle,
} = require("../controllers/articleController");

router.post("/", upload.single("image"), createArticle);

router.patch("/:id", upload.single("image"), updateArticle);

router.get("/subtype/:subType", getArticlesBySubType);

router.get("/:id", getArticleById);

router.delete("/:id", deleteArticle);

module.exports = router;
