module.exports = {
  HOST: "db-pae.ccyj9hfbu3hm.eu-west-3.rds.amazonaws.com",
  USER: "admin",
  PASSWORD: "adminpae",
  DB: "pae",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};