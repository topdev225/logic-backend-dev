const okta = require('@okta/okta-sdk-nodejs');
var lodashFilter = require('lodash.filter');
var webapp_db = require('../../sql_connections/webapp');


var okta_user_groups = {
  get_data: function(req,res){
    var customer_group = req.headers.customer_group
    var data = JSON.parse(req.headers.data)
    var update_users = data.group_ids
    var group_name = data.group_name

    const client = new okta.Client({
      orgUrl: 'https://authenticate.logicioe.com',
      token: '00v8kNV7Tab56WXX2VsuoY80xZURr205_e800B0wi9'
    });


    function newGroup(customer_group, group_name, update_users){


      webapp_db.query(`insert into user_groups (customer_group, user_group_name) values ('${customer_group}', '${group_name}')`, function (new_err, new_result, new_fields) {
        if (new_err) throw new_err;
      })

      for(let i=0; i<update_users.length; i++ ){
        client.getUser(update_users[i])
          .then(user => {
            if(user.profile.user_groups === undefined ){
              var user_group_list_temp = []
            } else {
              user_group_list_temp = [...user.profile.user_groups]
            }
            user_group_list_temp.push(group_name)
            user.profile.user_groups = [...user_group_list_temp]
            user.update()
            .then(response => {
              if(i === update_users.length-1 && response){
                res.send('added')
              }
            })
            .catch(err => {
              console.log(err)
              res.status(400);
              res.send(err)
            });
          })
      }
    };

    async function updateGroup(customer_group, group_name, update_users) {
      var group_search = 'profile.user_groups eq "' + group_name + '"'
      var current_group_users = []

      const okta_users = client.listUsers({
        search: group_search
      });

      okta_users.each(user => {
        var user_id = user.id
        current_group_users.push(user_id)
      }).then(() => {

        // check if the user needs the group
        for(let i=0; i<update_users.length; i++){
          if(current_group_users.indexOf(update_users[i]) > -1){
            //user already has the group
          } else {
            client.getUser(update_users[i])
              .then(user => {
                if(user.profile.user_groups === undefined ){
                  var user_group_list_temp = []
                } else {
                  user_group_list_temp = [...user.profile.user_groups]
                }
                user_group_list_temp.push(group_name)
                user.profile.user_groups = [...user_group_list_temp]
                user.update()
                .then(response => {
                  // console.log(response)
                })
                .catch(err => {
                  console.log(err)
                  res.status(400);
                  res.send(err)
                });
              });
            };
        };

        // Remove the group from the user
        for(let i=0; i<current_group_users.length; i++){
          if(update_users.indexOf(current_group_users[i]) > -1) {
            // Users good, do nothing
          } else {
            client.getUser(current_group_users[i])
              .then(user => {
                user_group_list_temp = [...user.profile.user_groups]
                const index = user_group_list_temp.indexOf(group_name)
                user_group_list_temp.splice(index, 1)
                user.profile.user_groups = [...user_group_list_temp]
                user.update()
                .then(response => {
                  // console.log(response)
                })
                .catch(err => {
                  console.log(err)
                  res.status(400);
                  res.send(err)
                });
              });
          };
        };

      }).catch(err => {
        console.log(err)
        res.status(400);
        res.send(err)
      });
      res.send('updated')
    };


    // This runs first.
    if(req.headers.new_group === 'true'){
      newGroup(customer_group, group_name, update_users)
    } else {
      updateGroup(customer_group, group_name, update_users)
    }

  }
}

exports.data = okta_user_groups
