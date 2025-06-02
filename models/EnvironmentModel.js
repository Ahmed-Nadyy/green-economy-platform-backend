const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Environment = sequelize.define("Environment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    toleranceToSalinity: {
        type : DataTypes.STRING,
        allowNull: true,
    },
    arabicToleranceToSalinity: {
        type : DataTypes.STRING,
        allowNull: true,
    },
    requiredHumidityPercentage: {
        type : DataTypes.NUMBER,
        allowNull: true,
    },
    suitableSolidType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicSuitableSolidType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    appropriateTemperatureForFarming: {
        type: DataTypes.NUMBER,
        allowNull: true,
    },
});

module.exports = Environment;