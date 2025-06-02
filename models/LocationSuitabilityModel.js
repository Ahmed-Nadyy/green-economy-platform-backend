const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LocationSuitability = sequelize.define("LocationSuitability", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    highestProductionAreas: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicHighestProductionAreas: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    plantedInOldLand: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicPlantedInOldLand: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    suitableForDesert: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicSuitableForDesert: {
        type: DataTypes.STRING,
        allowNull: true,
    }

});

module.exports = LocationSuitability;