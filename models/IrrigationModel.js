const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Irrigation = sequelize.define("Irrigation", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
});

module.exports = Irrigation;