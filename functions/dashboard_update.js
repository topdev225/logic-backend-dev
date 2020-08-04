
var webapp_db = require('../sql_connections/webapp.js')

var dashboard_update = {
  post_data: function(req, res){
    let email = req.headers.email
    let dashboardName = req.headers.dashboardname
    let dashboardJSON = req.headers.dashboardjson
    debugger
    webapp_db.query(`update dashboards set dashboard_json = '${dashboardJSON}' where user_name = '${email}' and dashboard_name = '${dashboardName}'`, function (err, result, fields) {
        if (err) throw err;
        res.send(result)
      })
  }
}

exports.data = dashboard_update
