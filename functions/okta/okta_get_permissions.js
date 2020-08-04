const okta = require('@okta/okta-sdk-nodejs');
var lodashFilter = require('lodash.filter');
var base64 = require('base-64');
var fetch = require('node-fetch');
var webapp_db = require('../../sql_connections/webapp');


var okta_get_permissions = {
  get_data: async function(req,res){
    let users = req.headers.user_list

    const client = new okta.Client({
      orgUrl: 'https://authenticate.logicioe.com',
      token: '00v8kNV7Tab56WXX2VsuoY80xZURr205_e800B0wi9'
    });


    async function getHostGroups(cluster_list, data){

      for(let i=0; i<cluster_list.length; i++){

        let cluster_name = ''
        webapp_db.query(`select display_name,
                        organization
                        from clusters
                        where organization = '${cluster_list[i]}'`,
                        function (err, result) {
                            cluster_name = result[0].display_name
                        })



        await fetch(`https://logicioe.com/${cluster_list[i]}/monitoring/list/hostgroups?&format=json`, {
          headers: {
            'Accept': 'application/json',
            "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
          }
        }).then(res => res.json())
        .then(json => {

          var groups = []
          for(let group_index=0; group_index<json.length; group_index++){
            var group_name = json[group_index].hostgroup_alias
            groups.push({ cluster_name: cluster_name, group_name: group_name})
          }

          //check for new clusters
          if(data.hostgroups_permissions.findIndex(i => i.cluster_name === cluster_name ) > -1) {

            // check for new groups
            for(let group_index=0; group_index<groups.length; group_index++){
              if(data.hostgroups_permissions.findIndex(i => i.group_name === groups[group_index].group_name && i.cluster_name === cluster_name ) > -1 ) {
                // all good
              } else {
                data.hostgroups_permissions.push({cluster_name: cluster_name, group_name: groups[group_index].group_name, read_value: false, write_value: false})
              }
            }

            // check for groups to delete
            // build group list from okta for this cluster
            let group_list = []
            for(let group_builder_index=0; group_builder_index<data.hostgroups_permissions.length; group_builder_index++){
              if(data.hostgroups_permissions[group_builder_index].cluster_name === cluster_name ) {
                group_list.push(data.hostgroups_permissions[group_builder_index].group_name)
              }
            }


            for(let okta_group_index=0; okta_group_index<group_list.length; okta_group_index++){

              if(groups.findIndex(i => i.group_name === group_list[okta_group_index] ) > -1){
                // console.log('group ' + group_list[okta_group_index] + ' found in icinga')
              } else {
                  let group_to_remove = data.hostgroups_permissions.findIndex(i => i.group_name === group_list[okta_group_index] && i.cluster_name === cluster_name )
                  data.hostgroups_permissions.splice(group_to_remove, 1)
              }

            }



            //if no new cluster, add the data
          } else {
            for(let new_group_index=0; new_group_index<groups.length; new_group_index++){
              data.hostgroups_permissions.push({cluster_name: cluster_name, group_name: groups[new_group_index].group_name, read_value: false, write_value: false})
            }
          }

          if(i === cluster_list.length-1){
            res.send(data)
          }
        })
      }

    }

    async  function getOktaValues(users){
      let data = { account_settings: 'None',
                   system_settings: 'None',
                   custom_boards: 'None',
                   reports: 'None',
                   inventory_permissions: 'None',
                   hostgroups_permissions: []
                  }

      client.getUser(users)
        .then(user => {
          if(user.profile.hostgroups_permissions){
            let hostgroups_counter = user.profile.hostgroups_permissions.length

            for(let i=0; i<hostgroups_counter; i++ ){
              data.hostgroups_permissions.push(JSON.parse(user.profile.hostgroups_permissions[i]))
            }
          }
          data.account_settings = user.profile.account_settings
          data.system_settings = user.profile.system_settings
          data.custom_boards = user.profile.custom_boards
          data.reports = user.profile.reports
          data.inventory_permissions = user.profile.inventory_permissions
          getHostGroups(user.profile.cluster_access, data)

        }).catch(err => {
          console.log(err)
          res.status(400);
          res.send(err)
        });
    }
    getOktaValues(users)
  }
}

exports.data = okta_get_permissions
