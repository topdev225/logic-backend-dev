
var request = require('request');
var webapp_db = require('../sql_connections/webapp')

var get_services = {
  get_data: async function(req,res){
    let org = req.headers.organization

    webapp_db.query(`select cluster, organization from clusters where organization = '${org}'`, async function (err, result, fields) {

        if (err) throw err;

        let cluster = result[0].cluster
        let organization = result[0].organization

        request.get(`https://${cluster}/v1/objects/services?attrs=vars&attrs=display_name&attrs=last_check_result&attrs=state&joins=host.name`, {
          'auth': {
            'user': 'logic',
            'pass': 'America11!!',
            'sendImmediately': false
          }
        }, async function (error, response, body) {

          body = JSON.parse(body)

          res.send(body)

      })
    })
  }
}

exports.data = get_services
