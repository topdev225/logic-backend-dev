var mysql = require('mysql');

var webapp_db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Password2020",
  database: "development",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = webapp_db;