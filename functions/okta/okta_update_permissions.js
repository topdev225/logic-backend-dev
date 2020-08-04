const okta = require('@okta/okta-sdk-nodejs');
var lodashFilter = require('lodash.filter');
var base64 = require('base-64');
var fetch = require('node-fetch');
var webapp_db = require('../../sql_connections/webapp');


var okta_update_permissions = {
  update_data: async function(req,res){
    let users = req.headers.user_list
    let permissions = JSON.parse(req.headers.permissions)
    const client = new okta.Client({
      orgUrl: 'https://authenticate.logicioe.com',
      token: '00v8kNV7Tab56WXX2VsuoY80xZURr205_e800B0wi9'
    });

    function updatePermissions(users, permissions) {
      client.getUser(users)
        .then(user => {
          let hostgroups_permissions = []
          for(let i=0; i<permissions.hostgroups_permissions.length; i++){
            let cluster_name = permissions.hostgroups_permissions[i].cluster_name
            let group_name = permissions.hostgroups_permissions[i].group_name
            let read_value = permissions.hostgroups_permissions[i].read_value
            let write_value = permissions.hostgroups_permissions[i].write_value
            hostgroups_permissions.push(JSON.stringify({ cluster_name: cluster_name,
                                                         group_name: group_name,
                                                         read_value: read_value,
                                                         write_value:write_value
                                                       }))
          }

          user.profile.account_settings = permissions.account_settings
          user.profile.system_settings = permissions.system_settings
          user.profile.custom_boards = permissions.custom_boards
          user.profile.reports = permissions.reports
          user.profile.inventory_permissions = permissions.inventory_permissions
          user.profile.hostgroups_permissions = hostgroups_permissions
          user.update()
          .then(response => {
            // console.log(response)
            res.send('ok')
          }).catch(err => {
            console.log(err)
            res.status(400);
            res.send(err)
          });
        })
      }



    updatePermissions(users, permissions)


  }
}

exports.data = okta_update_permissions
