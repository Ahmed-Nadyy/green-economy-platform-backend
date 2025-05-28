const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Diseases = sequelize.define("Diseases", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
});

module.exports = Diseases;