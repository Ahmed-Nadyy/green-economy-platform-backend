const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Environment = sequelize.define("Environment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
});

module.exports = Environment;