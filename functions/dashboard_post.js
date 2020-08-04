
var webapp_db = require('../sql_connections/webapp.js')

var dashboard_post = {
  post_data: function(req, res){
    let email = req.headers.email
    let dashboardName = req.headers.dashboardname
    let dashboardJSON = req.headers.dashboardjson
    webapp_db.query(`insert into dashboards ( user_name, dashboard_name, dashboard_json) values ( '${email}', '${dashboardName}', '${dashboardJSON}')`, function (err, result, fields) {
        if (err) throw err;
        res.send(result)
      })
  }
}

exports.data = dashboard_post
