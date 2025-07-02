const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Background = sequelize.define('Background', {
  section: {
    type: DataTypes.ENUM('platform', 'institutionWord', 'gallery'),
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = Background;
