
var mysql = require('mysql');
var fs = require('fs');
const path = require("path");

var icinga_db = {
  get_connection: function(host) {
    var database = mysql.createPool({
      connectionLimit : 10,
      queueLimit: 100,
      host: host,
      user: "logic",
      password: "America11!!",
      database: "icinga2",
      ssl: {
          ca: fs.readFileSync(path.resolve(__dirname, '../ssl/mySQL/ca.pem')),
          key: fs.readFileSync(path.resolve(__dirname, '../ssl/mySQL/client-key.pem')),
          cert: fs.readFileSync(path.resolve(__dirname, '../ssl/mySQL/client-cert.pem'))
      }
    });
    module.exports.connection = database
  }
}

exports.data = icinga_db
