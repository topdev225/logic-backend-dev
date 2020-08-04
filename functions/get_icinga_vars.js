
var director_db = require('../sql_connections/icinga_director_db.js')

var get_icinga_vars = {
  get_data: function(req, res){

    let cluster = req.headers.cluster

    let vars = {}
    let setup_connection = director_db.data.get_connection(cluster)
    let director_db_connection = director_db.connection

    director_db_connection.query(`select distinct(varname) as hostvars from icinga_host_var;`, function (err, result, fields) {
      let hostVars = result.map(item => item.hostvars)
      saveHostVars(hostVars)
    })

    async function saveHostVars(fetchedHostVars) {
      vars['hosts'] = fetchedHostVars
      if(!!vars["hosts"] && !!vars["services"]){
        res.send(vars)
      }
    }

    director_db_connection.query(`select distinct(varname) as servicevars from icinga_service_var;`, function (err, result, fields) {
      let serviceVars = result.map(item => item.servicevars)
      saveServiceVars(serviceVars)
    })

    async function saveServiceVars(fetchedServiceVars) {
      vars['services'] = fetchedServiceVars
      if(!!vars["hosts"] && !!vars["services"]){
        res.send(vars)
      }
    }
  }
}

exports.data = get_icinga_vars
