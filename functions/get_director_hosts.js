
var fetch = require('node-fetch');
var base64 = require('base-64');

var get_director_hosts = {
  get_data: async function(req, res){
    let org = req.headers.organization

      await fetch(`https://logicioe.com/${org}/director/hosts`, {
        headers: {
          'Accept': 'application/json',
          "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
        }
      }).then(res => res.json())
        .then(async function(json) {
        res.send({data: json, organization: org});
    })
    .catch(function(err) {
      console.log(err)
    });
  }
}

exports.data = get_director_hosts
