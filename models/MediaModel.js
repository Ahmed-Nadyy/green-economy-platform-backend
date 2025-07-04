const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Media = sequelize.define("Media", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  facebookLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  youtubeLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tiktokLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  whatsappLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Media;
