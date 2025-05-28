const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Economics = sequelize.define("Economics", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
});

module.exports = Economics;