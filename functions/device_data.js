var base64 = require('base-64');
var fetch = require('node-fetch');
var webapp_db = require('../sql_connections/webapp')

var device_data = {
  get_data: async function(req, res){
    let org = req.headers.organization
    webapp_db.query(`select cluster, display_name from clusters where organization = '${org}'`, async function (err, result, fields) {
        if (err) throw err;

        let cluster = result[0].cluster
        let organization = result[0].display_name
        let data = { "host_data": [], "service_data": [] }
        console.log('www', cluster)

        await fetch (`https://${cluster}/v1/objects/hosts?attrs=name&attrs=display_name&attrs=vars&attrs=last_check_result&attrs=state&attrs=last_hard_state_change`, {
          headers: {
            'Accept': 'application/json',
            "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
          }
        })
        .then(res => res.json())
        .then(json => {
            data.host_data = json.results
        })
        .catch(function(err) {
           console.log(err)
        });

        await fetch (`https://${cluster}/v1/objects/services?attrs=vars&attrs=display_name&attrs=last_check_result&attrs=state&joins=host.name&joins=host.display_name&attrs=last_hard_state_change`, {
           headers: {
             'Accept': 'application/json',
             "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
           }
        })
        .then(res => res.json())
        .then(json => {
             data.service_data = json.results
             res.send({data: data, organization: organization})
        })
        .catch(function(err) {
            res.send(err)
        });
  })
}
}
exports.data = device_data;
