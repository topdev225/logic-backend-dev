const okta = require('@okta/okta-sdk-nodejs');
var webapp_db = require('../../sql_connections/webapp')

var okta_user_group_remove = {
  update_data: function(req,res){
    var customer_group = req.headers.customer_group
    var data = JSON.parse(req.headers.data)
    var update_users = data.group_ids
    var group_name = data.group_name

    const client = new okta.Client({
      orgUrl: 'https://authenticate.logicioe.com',
      token: '00v8kNV7Tab56WXX2VsuoY80xZURr205_e800B0wi9'
    });

    async function updateGroup(customer_group, group_name, update_users) {
      var group_search = 'profile.user_groups eq "' + group_name + '"'

      const okta_users = client.listUsers({
        search: group_search
      });

      okta_users.each(user => {
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
    }

    webapp_db.query(`delete from user_groups where customer_group = '${customer_group}' and user_group_name = '${group_name}'`, function (err, result, fields) {
      // console.log(result)
    })
    updateGroup(customer_group, group_name, update_users)
    res.send('ok')

  }
}

exports.data = okta_user_group_remove
