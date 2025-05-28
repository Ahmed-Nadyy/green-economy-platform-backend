const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Gallery = sequelize.define("Gallery", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("image", "video"),
    allowNull: false,
  },
});

module.exports = Gallery;
