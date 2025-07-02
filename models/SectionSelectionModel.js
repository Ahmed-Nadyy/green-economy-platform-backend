const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Background = require('./BackgroundModel');

const SectionSelection = sequelize.define('SectionSelection', {
  section: {
    type: DataTypes.ENUM('platform', 'institutionWord', 'gallery'),
    allowNull: false,
    unique: true,
  },
  backgroundId: {
    type: DataTypes.INTEGER,
    references: {
      model: Background,
      key: 'id',
    }
  }
}, {
  timestamps: true,
});

SectionSelection.belongsTo(Background, { foreignKey: 'backgroundId', as: 'selectedBackground' });

module.exports = SectionSelection;
