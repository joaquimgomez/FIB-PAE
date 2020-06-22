
//MySql
var mysql = require('mysql');

//Configuración del servidor
var config = require("./config");

const connection = mysql.createConnection(config.db);
  
// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});
  
module.exports = connection;