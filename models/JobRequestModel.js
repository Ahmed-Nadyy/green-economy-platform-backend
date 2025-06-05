const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobRequest = sequelize.define("JobRequest", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = JobRequest;
