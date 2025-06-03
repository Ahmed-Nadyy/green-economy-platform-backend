const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cultivation = sequelize.define("Cultivation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  cultivationMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arabicCultivationMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numberofIrrigations: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arabicNumberofIrrigations: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amountOfWaterRequiredPerFeddan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arabicAmountOfWaterRequiredPerFeddan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Cultivation;
