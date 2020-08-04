const okta = require('@okta/okta-sdk-nodejs');


var okta_profile = {
  update_data: function(req,res){
    var data = JSON.parse(req.headers.data)
    var customer_group = req.headers.customer_group

    const client = new okta.Client({
      orgUrl: 'https://authenticate.logicioe.com',
      token: '00v8kNV7Tab56WXX2VsuoY80xZURr205_e800B0wi9'
    });

    if(req.headers.new_profile === 'true'){

      const newUser = {
        profile: {
          firstName: data.given_name,
          lastName: data.family_name,
          email: data.email,
          login: data.email,
          organization: data.organization,
          mobilePhone: data.mobilePhone,
          zipCode: data.zipcode,
          mobileCarrier: data.mobileCarrier,
          streetAddress: data.streetAddress,
          state: data.state,
          city: data.city,
          customer_group: customer_group
        },
        credentials: {
          password : {
            value: data.password
          }
        }
      }

      client.createUser(newUser)
        .then(user => {
          const okta_group = client.listGroups({
            q: customer_group
          })

          var group_id = ''
          okta_group.each(group => {
            group_id = group.id
          })
          .then(() => {
            user.addToGroup(group_id)
            .then(() => {
              res.send('What')
            })
            .catch(err => {
              console.log(err)
              res.status(400);
              res.send(err)
            })
          })
        })
        .catch(err => {
          console.log(err)
          res.status(400);
          res.send(err)
        });

    } else {
      client.getUser(data.id)
        .then(user => {
          // Check profile mappings in Okta
          user.profile.firstName = data.given_name
          user.profile.lastName = data.family_name
          user.profile.email = data.email
          user.profile.organization = data.organization
          user.profile.mobilePhone = data.mobilePhone
          user.profile.zipCode = data.zipCode
          user.profile.mobileCarrier = data.mobileCarrier
          user.profile.streetAddress = data.streetAddress
          user.profile.state = data.state
          user.profile.city = data.city
          user.profile.cluster_access = [...data.cluster_access]
          user.update()
          .then(response => {

          })
          .catch(err => {
            console.log(err)
            res.status(400);
            res.send(err)
          })
          res.send('updated')
        })
      }
  }
}

exports.data = okta_profile
