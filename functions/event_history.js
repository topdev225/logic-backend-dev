
var base64 = require('base-64');
var fetch = require('node-fetch');

var event_history = {
  get_data: async function (req,res){

      let org = req.headers.organization
      let startDate = req.headers.startdate
      let endDate = req.headers.enddate

      function getFormattedDate(date){
        let monthsObj = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
        let year = `${date[11]}${date[12]}${date[13]}${date[14]}`; let day = `${date[8]}${date[9]}`; let month = `${date[4]}${date[5]}${date[6]}`
        month = monthsObj[month]
        return `${year}-${month}-${day}`
      }

      let formattedStartDate = getFormattedDate(startDate)
      let formattedEndDate = getFormattedDate(endDate)


      await fetch(`https://logicioe.com/${org}/monitoring/list/eventhistory?timestamp>${formattedStartDate}&timestamp<${formattedEndDate}&type=hard_state&format=json`, {
        headers: {
          'Accept': 'application/json',
          "Authorization": `Basic ${base64.encode(`logic:America11!!`)}`
        }
      }).then(res => res.json())
        .then(async function(json) {
        res.send(json)
      })
      .catch(function(err) {
        console.log(err)
      });
    }
}

exports.data = event_history
