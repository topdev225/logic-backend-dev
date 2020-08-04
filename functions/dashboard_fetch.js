
var webapp_db = require('../sql_connections/webapp.js')

var dashboard_fetch = {
  get_data: function(req, res){
    let email = req.headers.email
    webapp_db.query(`select * from dashboards where user_name = '${email}'`, function (err, result, fields) {
        if (err) throw err;
        res.send(result)
    })
  }
}

exports.data = dashboard_fetch
