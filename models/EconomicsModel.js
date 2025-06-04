const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Economics = sequelize.define("Economics", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  averageCostPerFeddan: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  averageProductivity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  averageNetProfit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
});

module.exports = Economics;
