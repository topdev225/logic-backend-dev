
var request = require('request');
var base64 = require('base-64');
var fetch = require('node-fetch');
var webapp_db = require('../sql_connections/webapp')
var moment = require('moment')

var get_devices = {
  get_data: async function(req, res){

  let org = req.headers.organization
  let device = req.headers.name
  let startDate = req.headers.startdate
  let endDate = req.headers.enddate
  let timeZone = req.headers.timezone

  startDate = moment(new Date(startDate)).format('HH:mm_YYYYMMDD')
  endDate = moment(new Date(endDate)).format('HH:mm_YYYYMMDD')

  webapp_db.query(`select cluster, organization from clusters where organization = '${org}'`, function (err, result, fields) {

      if (err) throw err;

      let cluster = result[0].cluster
      let organization = result[0].organization

      request.get(`https://${cluster}/v1/objects/services?attrs=vars&attrs=display_name&attrs=max_check_attempts&attrs=last_check_result&attrs=state&filter=match("${device}",host.name)`, {
        'auth': {
          'user': 'logic',
          'pass': 'America11!!',
          'sendImmediately': false
        }
      }, async function (error, response, body) {

        let arr = []

        if (!error && response.statusCode === 200) {

          let serviceList = JSON.parse(body)

          let slicedCluster = cluster.slice(0,cluster.indexOf(':'))

          arr.push(slicedCluster)

          let configurationData = {}

          let services = []

          for(let i=0; i<serviceList.results.length; i++){

              await fetch(`https://logicioe.com/${organization}/director/service?name=${serviceList.results[i].attrs.display_name}`, {
                headers: {
                  'Accept': 'application/json',
                  "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
                }
              }).then(res => res.json())
                .then(json => {
                  if(!json.error){
                    services.push(json)
                  }
              })
              .catch(function(err) {
                console.log(err)
              });
          }

          configurationData['services'] = services

          await fetch(`https://logicioe.com/${organization}/director/host?name=${device}`, {
            headers: {
              'Accept': 'application/json',
              "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
            }
          }).then(res => res.json())
            .then(async function(json) {
            configurationData['withtemplate'] = json
        })
        .catch(function(err) {
          console.log(err)
        });

          await fetch(`https://logicioe.com/${organization}/director/host?name=${device}&resolved=1`, {
            headers: {
              'Accept': 'application/json',
              "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
            }
          }).then(res => res.json())
            .then(json => {
            configurationData['host'] = json
        })
        .catch(function(err) {
          console.log(err)
        });

          await fetch(`https://logicioe.com/${organization}/director/hosts/templates`, {
            headers: {
              'Accept': 'application/json',
              "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
            }
          }).then(res => res.json())
            .then(json => {
            configurationData['templates'] = json
          })
          .catch(function(err) {
            console.log(err)
          });

          await fetch(`https://logicioe.com/${organization}/director/hostgroups`, {
            headers: {
              'Accept': 'application/json',
              "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
            }
          }).then(res => res.json())
            .then(json => {
            configurationData['hostgroups'] = json
          })
          .catch(function(err) {
            console.log(err)
          });

          let re = JSON.parse(body).results

          let graphite_ip_prep = cluster.substr(-7);
          let graphite_ip = cluster.replace(graphite_ip_prep, '1:80');

          // Graphite Fetches

          // http://3.19.151.204:60001

          await fetch(`http://${graphite_ip}/render?target=icinga2.${device}.host.*.perfdata.*.value&from=${startDate}&until=${endDate}&tz=${timeZone}&format=json`)
            .then(res => res.json())
            .then(json => {
              if (json.length > 0){

                json[0]['Type'] = 'Host'
                arr.push(json)
              }
            })
            .catch(function(err) {
              console.log(err)
            });;

          for (let i=0; i<re.length; i++){

            if (re[i].attrs.vars && re[i].attrs.vars.display_type === 'graph') {
              let displayName = re[i].attrs.display_name
              let underscoredDisplayName = displayName.split(' ').join('_')

              await fetch(`http://${graphite_ip}/render?target=icinga2.${device}.services.${underscoredDisplayName}.*.perfdata.*.value&tz=${timeZone}&until=${endDate}&from=${startDate}&format=json`)
                .then(res => res.json())
                .then(json => {
                  if (json.length > 0){
                    json[0]['displayName'] = displayName
                    arr.push(json)[0]
                  }
                })
                .catch(function(err) {
                  console.log(err)
                });

             } else if (re[i].attrs.vars && re[i].attrs.vars.display_type === 'static'){
               let displayName = re[i].attrs.display_name
               let output = re[i].attrs.last_check_result.output
               arr.push(`${displayName};+;${output}`)
             }
          }
          arr.push(configurationData)
          res.send(arr);
        }
       });
    });
  }
}

exports.data = get_devices
