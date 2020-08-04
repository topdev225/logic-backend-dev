const okta = require('@okta/okta-sdk-nodejs');
var webapp_db = require('../../sql_connections/webapp');

var okta_list_user_groups = {
  get_data: async function(req,res){
    var customer_group = req.headers.customer_group
    var data = { groups: [], customer_users: [] }


    const client = new okta.Client({
      orgUrl: 'https://authenticate.logicioe.com',
      token: '00v8kNV7Tab56WXX2VsuoY80xZURr205_e800B0wi9'
    });

    function getAllUsers(group_name, customer_group, user_list){
      const okta_group = client.listGroups({
        q: customer_group
      });
      okta_group.each(group => {
        group.listUsers().each(user => {
          var user_display_name = user.profile.firstName + ' ' + user.profile.lastName
          var user_id = user.id
          data.customer_users.push({ display_name: user_display_name, id: user_id })
        }).then(() => {
          res.send(data)
        })
        .catch(err => {
              console.log(err)
              res.status(400);
              res.send(err)
        });
      })
    };

    function getUsers (group_name, customer_group, group_list_length) {
      var group_search = 'profile.user_groups eq "' + group_name + '"'
      var user_list = []

      client.listUsers({
        search: group_search
      }).each(user => {
        var user_display_name = user.profile.firstName + ' ' + user.profile.lastName
        var user_id = user.id
        user_list.push({ display_name: user_display_name, id: user_id })
      }).then(() => {
        data.groups.push({ name: group_name, users: user_list })
        if(data.groups.length === group_list_length){
          getAllUsers(group_name, customer_group, user_list)
        }


      })
      .catch(err => {
        console.log(err)
        res.status(400);
        res.send(err)
      });
    };


    webapp_db.query(`select user_group_name
                      from user_groups
                      where customer_group = '${customer_group}'`,
                      function (err, result, fields) {
      if(result.length === 0 ){
        getUsers(group_name, customer_group, 1)
      } else {

        for(let i=0; i<result.length; i++) {
          var group_name = result[i].user_group_name
          getUsers(group_name, customer_group, result.length)
        }
      }
    })
  }
}

exports.data = okta_list_user_groups
