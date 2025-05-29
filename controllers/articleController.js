const Article = require("../models/ArticleModel");
const path = require("path");

// Create a new article
const createArticle = async (req, res) => {
  try {
    const articleData = { ...req.body };

    // Handle image upload
    if (req.file) {
      articleData.imageUrl = `/uploads/images/${req.file.filename}`;
    }

    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update article by ID
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const updateData = { ...req.body };

    // Handle image upload
    if (req.file) {
      updateData.imageUrl = `/uploads/images/${req.file.filename}`;
    }

    await article.update(updateData);
    res.json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get articles by subType with specific fields
const getArticlesBySubType = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { subType: req.params.subType },
      attributes: ["id", "type", "imageUrl", "title", "arabicTitle"],
    });
    res.json(articles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get article by ID with all data
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete article by ID
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    await article.destroy();
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createArticle,
  updateArticle,
  getArticlesBySubType,
  getArticleById,
  deleteArticle,
};
