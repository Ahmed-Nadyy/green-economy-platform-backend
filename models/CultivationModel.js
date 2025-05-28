const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cultivation = sequelize.define("Cultivation", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
});

module.exports = Cultivation;