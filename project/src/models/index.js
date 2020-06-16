const dbConfig = require("../bd/config.json");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.db.database, dbConfig.db.user, dbConfig.db.password, {
  host: dbConfig.db.host,
  dialect: dbConfig.db.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.db.pool.max,
    min: dbConfig.db.pool.min,
    acquire: dbConfig.db.pool.acquire,
    idle: dbConfig.db.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
