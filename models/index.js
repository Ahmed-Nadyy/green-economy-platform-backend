const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Example model
// db.User = require('./user.model')(sequelize, Sequelize);

module.exports = db;
