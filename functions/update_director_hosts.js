
var fetch = require('node-fetch');
var base64 = require('base-64');

var update_director_hosts = {
  post_data: async function(req,res){
      let org = req.headers.organization
      let device = req.headers.name
      let hostUpdates = req.headers.hostupdates
      let groups = JSON.parse(req.headers.groups)

      let groupPost

      for(let i=0; i<groups.length; i++){
          await fetch(`https://logicioe.com/${org}/director/hostGroup`, {
            headers: {
              'Accept': 'application/json',
              "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
            },
            method: 'post',
            body: JSON.stringify(groups[i])
          })
          .then(res => res.json())
          .then(async function(json) {
            if(!json.error){
              groupPost = json
            }
          })
          .catch(function(err) {
            debugger
          });
        }

        await fetch(`https://logicioe.com/${org}/director/host?name=${device}`, {
          headers: {
            'Accept': 'application/json',
            "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
          },
          method: 'post',
          body: hostUpdates
        })
        .then(res => res.json())
        .then(async function(json) {
          res.send(json)
        })
        .catch(function(err) {
          if(!!groupPost){
            res.send(groupPost)
          } else {
            res.send({})  
          }
        });
    }
}

exports.data = update_director_hosts
