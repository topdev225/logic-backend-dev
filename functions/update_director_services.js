
var webapp_db = require('../sql_connections/webapp')
var fetch = require('node-fetch');
var base64 = require('base-64');

var update_director_services = {
  post_data: async function(req,res){
    let org = req.headers.organization
    let device = req.headers.name
    let serviceUpdates = req.headers.serviceupdates
    let servicenum = req.headers.servicenum
    let parsedServiceUpdates = JSON.parse(serviceUpdates)

    webapp_db.query(`select cluster, organization from clusters where organization = '${org}'`, async function (err, result, fields) {

        let organization = result[0].organization

        let stringifiedService = JSON.stringify(parsedServiceUpdates[servicenum])

        await fetch(`https://logicioe.com/${organization}/director/service?name=${parsedServiceUpdates[servicenum].object_name}`, {
          headers: {
            'Accept': 'application/json',
            "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
          },
          method: 'post',
          body: stringifiedService
        })
        .then(res => res.json())
        .then(json => {
          res.send(json)
        })
        .catch(function(err) {
          res.send({})
        });

    })
  }
}

exports.data = update_director_services
