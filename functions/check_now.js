
var fetch = require('node-fetch');
var webapp_db = require('../sql_connections/webapp')
var base64 = require('base-64');

var check_now = {
  post_data:   async function(req,res){
      let device = req.headers.name
      let org = req.headers.organization

      webapp_db.query(`select cluster from clusters where organization = '${org}'`, async function (err, result, fields) {
          if (err) throw err;

          let cluster = result[0].cluster

        await fetch(`https://${cluster}/v1/actions/reschedule-check?filter=true&type=Service&host.name=${device}`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
          }
        })
        .then(res => res.json())
        .then(json => {
          res.send(json);
        })
        .catch(function(err) {
          console.log(err)
        });
      });
    }

}
exports.data = check_now
