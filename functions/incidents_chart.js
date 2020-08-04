var icinga_db = require('../sql_connections/icinga_db.js')
var webapp_db = require('../sql_connections/webapp.js')
var moment = require('moment')

var incidents_chart = {
  get_data: function(req,res){

    let startDate = moment( new Date(req.headers.startdate)).format('YYYY-MM-DD')
    let endDate = moment( new Date(req.headers.enddate)).format('YYYY-MM-DD')
    let cluster = req.headers.cluster


    webapp_db.query(`select cluster, organization from clusters where organization = '${cluster}'`, function (err, result) {

          if (err) throw err;

          let host = result[0].cluster.slice(0, -6);

          let setup_connection = icinga_db.data.get_connection(host)
          let icinga_db_connection = icinga_db.connection

          icinga_db_connection.getConnection(function(err, connection, results) {
            if (err) {

                res.json({ "code": 100, "status": "Error in connection database" });
                return;
            }

            connection.query(`select date(states.state_time) as date,
                              sum(case
                              	when states.state = '1' then '1' else '0' end
                              ) as warning,
                              sum(case
                              	when states.state = '2' then '1' else '0' end
                              ) as critical
                              from icinga_objects as objects,
                              icinga_statehistory as states
                              where
                              objects.object_id = states.object_id and
                              states.state_type = 1 and
                              states.state != 0 and
                              date(states.state_time) >= '${startDate}' and date(states.state_time) <= '${endDate}'
                              group by date(states.state_time)`,
                              function (err, result, fields) {
                                let chart_data = []
                                for(let i=0; i<result.length; i++) {
                                  let date = new Date(result[i].date)
                                  let warnings = result[i].warning
                                  let criticals = result[i].critical
                                  chart_data.push({ date: date, warnings: warnings, criticals: criticals})
                                }
                                res.send(chart_data)
                              }
            )
            connection.release();
        }
      )
      }
    )

}
}


exports.data = incidents_chart
