
var webapp_db = require('../sql_connections/webapp.js')
var base64 = require('base-64');
var fetch = require('node-fetch');
var moment = require('moment')

var dashboard_services_wizard = {
  get_data: async function(req,res){

      let displayName = req.headers.servicename
      let device = req.headers.devicename
      let org = req.headers.organization
      let timeZone = req.headers.timezome
      let endDate = req.headers.enddate
      let startDate = req.headers.startdate

      startDate = moment(new Date(startDate)).format('HH:mm_YYYYMMDD')
      endDate = moment(new Date(endDate)).format('HH:mm_YYYYMMDD')

      let underscoredDisplayName = displayName.split(' ').join('_')

      let obj = {
        info: {displayName: displayName, device: device}
      }

      webapp_db.query(`select cluster, organization from clusters where organization = '${org}'`, async function (err, result, fields) {

          if (err) throw err;

          let cluster = result[0].cluster
          let organization = result[0].organization

          let graphite_ip_prep = cluster.substr(-7);
          let graphite_ip = cluster.replace(graphite_ip_prep, '1:80');

          // 3.19.151.204:60001

      await fetch(`http://${graphite_ip}/render?target=icinga2.${device}.services.${underscoredDisplayName}.*.perfdata.*.value&tz=${timeZone}&until=${endDate}&from=${startDate}&format=json`)
        .then(res => res.json())
        .then(json => {
          if (json.length > 0){
            obj['data'] = json
            res.send(obj)
          } else {
            res.send({})
          }
        })
        .catch(function(err) {
          console.log(err)
        });
      })
  }
}
exports.data = dashboard_services_wizard
