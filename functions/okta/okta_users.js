const okta = require('@okta/okta-sdk-nodejs');


var okta_users = {
  update_data: function(req,res){

    const client = new okta.Client({
      orgUrl: 'https://authenticate.logicioe.com',
      token: '00v8kNV7Tab56WXX2VsuoY80xZURr205_e800B0wi9'
    });

    const customer_group = req.headers.group
    const okta_group = client.listGroups({
      q: customer_group
    })
    const users = { users: [] }

    okta_group.each(group => {

      group.listUsers().each(user => {

        var user_id = user.id
        var user_profile = user.profile
        var user_status = user.status
        var user_last_login = new Date(user.lastLogin)
        var user_password_changed = new Date(user.passwordChanged)
        var user_created = new Date(user.created)

        if(user_status === 'PROVISIONED'){
          user_status = 'Never Logged In'
        }
        if(user_status === 'ACTIVE'){
          user_status = 'Active'
        }

        users.users.push({id: user_id,
                          status: user_status,
                          last_login: user_last_login,
                          password_changed: user_password_changed,
                          created: user_created,
                          profile: user_profile
                        })
                      })
                      .then(() => {
                        res.send(users)
                      })

    })
    .catch(err => {
          console.log(err)
          res.status(400);
          res.send(err)
        })

  }
}

exports.data = okta_users
