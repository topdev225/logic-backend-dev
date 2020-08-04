
var webapp_db = require('../sql_connections/webapp.js')
var icinga_db = require('../sql_connections/icinga_db.js')
var moment = require('moment')


var sla_graph = {
  get_data: function(req,res){

    let hostnames = req.headers.hostnames.split(',')
    let org = req.headers.org
    let startDate = moment( new Date(req.headers.startdate))
    let endDate = moment( new Date(req.headers.enddate))

    let results = {}

    webapp_db.query(`select cluster, organization from clusters where organization = '${org}'`, function (err, result, fields) {
      if (err) throw err;

      let host = result[0].cluster.slice(0, -6);

      let setup_connection = icinga_db.data.get_connection(host)
      let icinga_db_connection = icinga_db.connection

      icinga_db_connection.getConnection(function(results, err, connection) {

        for(let i=0; i<hostnames.length; i++){

          results[hostnames[i]] = []
          let current_host = hostnames[i]
          let date_counter = moment(endDate).diff(startDate, 'days')

          for(let index=0; index<date_counter; index++){

            let newStartDate = moment(startDate).add(index, 'days').format('YYYY-MM-DD')
            let newEndData = moment(startDate).add(index + 1, 'days').format('YYYY-MM-DD')

            connection.query(`select '${newStartDate}' as date,
                                name1,
                                availability(object_id, '${newStartDate}', '${newEndData}') as availablity
                              from icinga_objects
                              where objecttype_id = '1' and
                                is_active = '1' and name1 = '${current_host}';`, function (err, result, fields) {

                if (err) throw err;
                setValue(result)
            }) // end of availability query

            async function setValue(value) {
              results[hostnames[i]].push(value[0])

              if (Object.keys(results).length === hostnames.length &&
                  results[hostnames[hostnames.length-1]].length === date_counter){
                    if (results !== []){
                      res.send(results)
                    }
                  }
              } // end of setValue

          } // end of date counter loop


        } // End of hostname for loop
        connection.release();

      }.bind(icinga_db_connection, results)) // End of Icinga DB Query
    }) // End of webapp query
  }
}

exports.data = sla_graph
