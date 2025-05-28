const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Crop = sequelize.define("Crop", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    season: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.NUMBER,
        allowNull: true,
    },
    arabicDescription: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = Crop;