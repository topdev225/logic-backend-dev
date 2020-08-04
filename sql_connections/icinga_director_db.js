
var mysql = require('mysql');
var fs = require('fs');
const path = require("path");

var director_db = {
  get_connection: function(host) {
    var database = mysql.createPool({
      connectionLimit : 5,
      host: host,
      user: "logic",
      password: "America11!!",
      database: "director",
      ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, '../ssl/mySQL/ca.pem')),
        key: fs.readFileSync(path.resolve(__dirname, '../ssl/mySQL/client-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, '../ssl/mySQL/client-cert.pem'))
      }
    });
    module.exports.connection = database
  }
}

exports.data = director_db
