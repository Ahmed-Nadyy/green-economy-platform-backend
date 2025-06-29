const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Crop = sequelize.define("Crop", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arabicName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arabicTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  season: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arabicDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  growthPeriod: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Crop;
