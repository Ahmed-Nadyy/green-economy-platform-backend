const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Galary = sequelize.define("Galary", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false,
  }
});

module.exports = Galary;
