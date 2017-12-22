var mysql = require("mysql");

var connection;

module.exports = {

    dbConnection: function () {

        connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "mydb",
            multipleStatements: true
        });

        //connection = mysql.createConnection({multipleStatements: true});

        connection.connect(function(err){
            if(!err) {
                console.log("Baza je uspjesno povezana!");
            } else {
                console.log("Greska pri povezivanju sa bazom!");
            }
        });
        return connection;
    }

};
