
var base64 = require('base-64');
var fetch = require('node-fetch');
var webapp_db = require('../sql_connections/webapp')

var get_alarms = {
  get_data: async function(req,res){
    let org = req.headers.organization

    webapp_db.query(`select cluster, display_name from clusters where organization = '${org}'`, async function (err, result, fields) {

        let alarms = []
        let arr = []

        if (err) throw err;

        let cluster = result[0].cluster
        await fetch (`https://${cluster}/v1/objects/hosts?attrs=name&attrs=display_name&attrs=state&attrs=last_hard_state_change&attrs=vars&filter=host.state!=0`, {
          headers: {
            'Accept': 'application/json',
            "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
          }
        }).then(res => res.json())
          .then(json => {
            for(let i = 0; i < json.results.length; i++){
              alarms.push(json.results[i]);
            }
         })
         .catch(function(err) {
           console.log(err)
         });

         await fetch (`https://${cluster}/v1/objects/services?attrs=display_name&attrs=state&joins=host.name&joins=host.display_name&attrs=last_hard_state_change&attrs=vars&filter=service.state!=0`, {
           headers: {
             'Accept': 'application/json',
             "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
           }
         }).then(res => res.json())
           .then(json => {
             for(let i = 0; i < json.results.length; i++){
               alarms.push(json.results[i]);
             }
          })
          .catch(function(err) {
            console.log(err)
          });

        res.send(alarms)

      })
  }
}
exports.data = get_alarms
