const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Economics = sequelize.define("Economics", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    averageCostPerFeddan: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    AverageProductivity: {
        type : DataTypes.NUMBER,
        allowNull: true,
    },
    sellingPrice: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    averageNetProfit: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
});

module.exports = Economics;