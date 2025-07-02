const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Background = sequelize.define("Crop", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM,
    allowNull: false,
  }
 });

module.exports = Background;
