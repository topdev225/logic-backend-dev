
var fetch = require('node-fetch');
var base64 = require('base-64');
var moment = require('moment');

var jira_data = {
  get_data: async function(req, res){

    let startDate = moment(new Date(req.headers.startdate)).format('YYYY-MM-DD')
    let endDate = moment(new Date(req.headers.enddate)).format('YYYY-MM-DD')

    let issuesLength = 100
    let start = 0
    let issues = []

    while(issuesLength === 100){
      await fetch(`https://prosyslogic.atlassian.net/rest/api/3/search?jql=project%20%3D%20PROS%20AND%20created%20>%3D%20${startDate}%20AND%20created%20<%3D%20${endDate}%20order%20by%20created%20DESC&maxResults=100&startAt=${start}`, {
        headers: {
          'Accept': 'application/json',
          "Authorization": `Basic ${base64.encode(`logic@prosyslogic.com:diAl07dRzP8SDWZMhCiFFF09`)}`
        }
      }).then(res => res.json())
        .then(async function(json) {
          issuesLength = json.issues.length
          start += 100
          issues = issues.concat(json.issues)
        })
        .catch(function(err) {
          console.log(err)
        });
    }

    const jira_data = { "priority": [
                        {"P1": [{"open": 0 }, { "closed": 0 }, { "total": 0}]},
                        {"P2": [{"open": 0 }, { "closed": 0 }, { "total": 0}]},
                        {"P3": [{"open": 0 }, { "closed": 0 }, { "total": 0}]},
                        {"P4": [{"open": 0 }, { "closed": 0 }, { "total": 0}]}
                        ],
                      "closedby": {},
                      "issue_type": {},
                      "reporter": {},
                      "priority_count": {}
                    }

    for(let i=0; i< issues.length; i++) {

      // Set priorities
      if(issues[i].fields.priority.name === 'Highest') {
        jira_data.priority[0].P1[2].total += 1
        if (issues[i].fields.status.statusCategory.key === 'done'){
          jira_data.priority[0].P1[1].closed += 1

          if (issues[i].fields.assignee !== null){
            if (!jira_data.closedby[issues[i].fields.assignee.displayName] ){
              jira_data.closedby[issues[i].fields.assignee.displayName] = 1
            } else {
              jira_data.closedby[issues[i].fields.assignee.displayName] += 1
            }
          }

        } else {
          jira_data.priority[0].P1[0].open += 1
        }
      } else if (issues[i].fields.priority.name === 'High') {
        jira_data.priority[1].P2[2].total += 1
        if (issues[i].fields.status.statusCategory.key === 'done'){
          jira_data.priority[1].P2[1].closed += 1

          if (issues[i].fields.assignee !== null){
            if (!jira_data.closedby[issues[i].fields.assignee.displayName] ){
              jira_data.closedby[issues[i].fields.assignee.displayName] = 1
            } else {
              jira_data.closedby[issues[i].fields.assignee.displayName] += 1
            }
          }

        } else {
          jira_data.priority[1].P2[0].open += 1
        }
      } else if (issues[i].fields.priority.name === 'Medium') {
        jira_data.priority[2].P3[2].total += 1
        if (issues[i].fields.status.statusCategory.key === 'done'){
          jira_data.priority[2].P3[1].closed += 1
          if (issues[i].fields.assignee !== null){
            if (!jira_data.closedby[issues[i].fields.assignee.displayName] ){
              jira_data.closedby[issues[i].fields.assignee.displayName] = 1
            } else {
              jira_data.closedby[issues[i].fields.assignee.displayName] += 1
            }
          }
        } else {
          jira_data.priority[2].P3[0].open += 1
        }
      } else  {
        jira_data.priority[3].P4[2].total += 1
        if (issues[i].fields.status.statusCategory.key === 'done'){
          jira_data.priority[3].P4[1].closed += 1
          if (issues[i].fields.assignee !== null){
            if (!jira_data.closedby[issues[i].fields.assignee.displayName] ){
              jira_data.closedby[issues[i].fields.assignee.displayName] = 1
            } else {
              jira_data.closedby[issues[i].fields.assignee.displayName] += 1
            }
          } else {
            jira_data.closedby[issues[i].fields.assignee.displayName] += 1
          }
        } else {
          jira_data.priority[3].P4[0].open += 1
        }
      }


      // Set Issue Type
      if (!jira_data.issue_type[issues[i].fields.issuetype.name] ){
        jira_data.issue_type[issues[i].fields.issuetype.name] = 1
      } else {
        jira_data.issue_type[issues[i].fields.issuetype.name] += 1
      }

      // Set Reporter
      if (!jira_data.reporter[issues[i].fields.reporter.displayName] ){
        jira_data.reporter[issues[i].fields.reporter.displayName] = 1
      } else {
        jira_data.reporter[issues[i].fields.reporter.displayName] += 1
      }

      // Set priority_count
      if (!jira_data.priority_count[issues[i].fields.priority.name] ){
        jira_data.priority_count[issues[i].fields.priority.name] = 1
      } else {
        jira_data.priority_count[issues[i].fields.priority.name] += 1
      }


    }
    res.send(jira_data)
  }
}

exports.data = jira_data
