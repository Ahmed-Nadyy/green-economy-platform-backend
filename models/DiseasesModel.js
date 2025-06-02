const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Diseases = sequelize.define("Diseases", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    diseases: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicDisease: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    preventionMethod: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    arabicPreventionMethod: {
        type: DataTypes.STRING,
        allowNull: true,
    }    
});

module.exports = Diseases;