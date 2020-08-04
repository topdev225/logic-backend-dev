
var base64 = require('base-64');
var fetch = require('node-fetch');

var host_group_status = {
  get_data: async function(req,res){
      let org = req.headers.organization

      await fetch(`https://logicioe.com/${org}/monitoring/list/hostgroups?&format=json`, {
        headers: {
          'Accept': 'application/json',
          "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
        }
      }).then(res => res.json())
        .then(async function(json) {
        res.send(json)
      })
      .catch(function(err) {
        console.log(err)
      });
    }
}
exports.data = host_group_status
