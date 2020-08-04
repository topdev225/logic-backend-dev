
var fetch = require('node-fetch');
var base64 = require('base-64');

var director_delete_host = {
  delete_data: async function(req, res){
      let org = req.headers.organization
      let hostObj = req.headers.hostobj
      let device = req.headers.hostname

        await fetch(`https://logicioe.com/${org}/director/host?name=${device}`, {
          headers: {
            'Accept': 'application/json',
            "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
          },
          method: 'delete',
          body: hostObj
        })
        .then(res => res.json())
        .then(json => {
          res.send(json);
        })
        .catch(function(err) {
          console.log(err)
        });
    }
}

exports.data = director_delete_host
