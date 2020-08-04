
var fetch = require('node-fetch');
var webapp_db = require('../sql_connections/webapp')
var base64 = require('base-64');

var director_deploy = {
  post_data: async function(req,res){

    debugger

      let org = req.headers.organization

      webapp_db.query(`select cluster, organization from clusters where organization = '${org}'`, async function (err, result, fields) {

        let organization = result[0].organization

        await fetch(`https://logicioe.com/${organization}/director/config/deploy`, {
          headers: {
            'Accept': 'application/json',
            "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
          },
          method: 'post'
        })
        .then(res => res.json())
        .then(json => {
          res.send(json);
        })
        .catch(function(err) {
          console.log(err)
        });
      })
    }
}

exports.data = director_deploy
