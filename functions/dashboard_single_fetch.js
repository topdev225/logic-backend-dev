
var webapp_db = require('../sql_connections/webapp.js')

var dashboard_single_fetch = {
  get_data: function(req, res){
    let email = req.headers.email
    let dashboardName = req.headers.dashboardname
    let dashboardJSON = req.headers.dashboardjson

    webapp_db.query(`select dashboard_name from dashboards where user_name = '${email}' and dashboard_name = '${dashboardName}';`, function (err, result, fields) {
        if (err) throw err;

        debugger

        let headers = {
          email: email,
          dashboardname: dashboardName,
          dashboardjson: dashboardJSON
        }

        result.push(headers)

        debugger

        res.send(result)
    })
  }
}

exports.data = dashboard_single_fetch
