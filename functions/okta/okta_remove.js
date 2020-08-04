const okta = require('@okta/okta-sdk-nodejs');


var okta_remove = {
  update_data: function(req,res){
    var data = JSON.parse(req.headers.data)

    const client = new okta.Client({
      orgUrl: 'https://authenticate.logicioe.com',
      token: '00v8kNV7Tab56WXX2VsuoY80xZURr205_e800B0wi9'
    });
    console.log(data.id)

    client.getUser(data.id)
      .then(user => {
        console.log(user.profile)
        user.deactivate()
        .then(() => user.delete())
        .then(() => res.send('good'))
      })
        .then(res => {

        })
        .catch(err => {
          console.log(err)
          res.status(400);
          res.send(err)
        })

  }
}

exports.data = okta_remove
