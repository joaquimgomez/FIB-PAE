var mysql = require('mysql');
var config = require("../config");

// eslint-disable-next-line no-unused-vars
var sqlConnection = function sqlConnection(sql, values, next) {

    //Significa que no hemos pasado 'values'
    if (arguments.length === 2) {
        next = values;
        values = null;
    }

    //Creamos la conexión
    var connection = mysql.createConnection(config.db);
    connection.connect(function(err) {
        if (err !== null){
            console.log("[MYSQL] Error connecting to mySql: " + err + '\n');
        }
    });

    connection.query(sql, values, function(err){
        
        //Cerramos la conexión
        connection.end();

        if (err) {
            throw err;
        }
        //Aplicamos la función con el resultado
        next.apply(this, arguments);
    });
}