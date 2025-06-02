const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Fertilization = sequelize.define("Fertilization", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    fertilizerTypes: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    arabicFertilizerTypes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fertilizationInstructions: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicFertilizationInstructions: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = Fertilization;