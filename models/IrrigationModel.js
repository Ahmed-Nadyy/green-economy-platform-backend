const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Irrigation = sequelize.define("Irrigation", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    traditionalFarmingMethod: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicTraditionalFarmingMethod: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    modernFarmingMethods: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicModernFarmingMethods: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    optimalPlantingDates: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicOptimalPlantingDates: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    agriculturalDensity: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicAgriculturalDensity: {
        type: DataTypes.STRING,
        allowNull: true,
    }


});

module.exports = Irrigation;