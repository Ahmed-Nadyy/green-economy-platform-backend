const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protected } = require("../middlewares/auth.middleware");
const {
  createArticle,
  updateArticle,
  getArticlesBySubType,
  getArticleById,
  deleteArticle,
} = require("../controllers/articleController");

router.post("/", protected, upload.single("image"), createArticle);

router.patch("/:id", protected, upload.single("image"), updateArticle);

router.get("/subtype/:subType", getArticlesBySubType);

router.get("/:id", getArticleById);

router.delete("/:id", protected, deleteArticle);

module.exports = router;
