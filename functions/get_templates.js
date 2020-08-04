
var fetch = require('node-fetch');
var base64 = require('base-64');

var get_templates = {
  get_data: async function(req,res){
      let organization = req.headers.organization
      await fetch(`https://logicioe.com/${organization}/director/hosts/templates`, {
        headers: {
          'Accept': 'application/json',
          "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
        }
      }).then(res => res.json())
        .then(json => {
          let templates = json.objects.map(obj => obj.object_name)
          res.send(templates)
        })
        .catch(function(err) {
          console.log(err)
        });
    }
}

exports.data = get_templates
