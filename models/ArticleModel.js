const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Article = sequelize.define("Article", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arabicTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arabicDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  intro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arabicIntro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  issueDefinition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arabicIssueDefinition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  importance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arabicImportance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  practicalSteps: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arabicPracticalSteps: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recommendations: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arabicRecommendations: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Article;
