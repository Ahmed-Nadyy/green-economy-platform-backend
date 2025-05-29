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

// Create a new article with image
router.post("/", upload.single("image"), createArticle);

// Update article by ID with optional image
router.patch("/:id", upload.single("image"), updateArticle);

// Get articles by subType with specific fields
router.get("/subtype/:subType", getArticlesBySubType);

// Get article by ID with all data
router.get("/:id", getArticleById);

// Delete article by ID
router.delete("/:id", deleteArticle);

module.exports = router;
