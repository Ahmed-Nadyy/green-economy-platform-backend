const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LocationSuitability = sequelize.define("LocationSuitability", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
});

module.exports = LocationSuitability;