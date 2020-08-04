
var webapp_db = require('../sql_connections/webapp.js')
var base64 = require('base-64');
var fetch = require('node-fetch');
var request = require('request');

var dashboard_devices_wizard = {
  get_data: async function(req, res){

    let org = req.headers.organization
    let device = req.headers.devicename

    webapp_db.query(`select cluster, organization from clusters where organization = '${org}'`, function (err, result, fields) {

        if (err) throw err;

        let cluster = result[0].cluster
        let organization = result[0].organization

        request.get(`https://${cluster}/v1/objects/services?attrs=vars&attrs=display_name&attrs=last_check_result&attrs=state&filter=match("${device}",host.name)`, {
          'auth': {
            'user': 'logic',
            'pass': 'America11!!',
            'sendImmediately': false
          }
        }, async function (error, response, body) {

          let arr = []

          if (!error && response.statusCode === 200) {

            let serviceList = JSON.parse(body)

            let slicedCluster = cluster.slice(0,cluster.indexOf(':'))

            arr.push(slicedCluster)

            let services = []

            for(let i=0; i<serviceList.results.length; i++){

                await fetch(`https://logicioe.com/${organization}/director/service?name=${serviceList.results[i].attrs.display_name}`, {
                  headers: {
                    'Accept': 'application/json',
                    "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
                  }
                }).then(res => res.json())
                  .then(json => {
                    services.push(json)
                })
                .catch(function(err) {
                  console.log(err)
                });
            }
            res.send(services)
          }
         });
      });
  }
}

exports.data = dashboard_devices_wizard
