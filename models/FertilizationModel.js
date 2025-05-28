const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Fertilization = sequelize.define("Fertilization", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
});

module.exports = Fertilization;