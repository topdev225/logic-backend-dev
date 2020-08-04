
var fetch = require('node-fetch');
var base64 = require('base-64');

var add_host = {
  post_data: function(req,res){
      let org = req.headers.organization
      let hostobj = req.headers.hostobj

        fetch(`https://logicioe.com/${org}/director/host`, {
          headers: {
            'Accept': 'application/json',
            "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
          },
          method: 'post',
          body: hostobj
        })
        .then(res => res.json())
        .then(async function(json) {
          res.send(json)
        })
        .catch(function(err) {
          res.send({})
        });
    }
}
exports.data = add_host
