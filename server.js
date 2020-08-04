var express = require('express');
var request = require('request');
var cors = require('cors');
var mysql = require('mysql');
var https = require('https');
var fetch = require('node-fetch');
var base64 = require('base-64');
var fs = require('fs');
var app = express();

// Functions
var device_data = require('./functions/device_data.js')
var director_hosts = require('./functions/get_director_hosts.js')
var jira_data = require('./functions/jira_data.js')
var get_services = require('./functions/get_services.js')
var get_alarms = require('./functions/get_alarms.js')
var get_devices = require('./functions/get_devices.js')
var get_templates = require('./functions/get_templates.js')
var check_now = require('./functions/check_now.js')
var update_director_services = require('./functions/update_director_services.js')
var update_director_hosts = require('./functions/update_director_hosts.js')
var add_host = require('./functions/add_host.js')
var director_deploy = require('./functions/director_deploy.js')
var director_delete_host = require('./functions/director_delete_host.js')
var incidents_chart = require('./functions/incidents_chart.js')
var host_group_status = require('./functions/host_group_status.js')
var sla_graph = require('./functions/sla_graph.js')
var get_icinga_vars = require('./functions/get_icinga_vars.js')
var dashboard_devices_wizard = require('./functions/dashboard_devices_wizard.js')
var dashboard_services_wizard = require('./functions/dashboard_services_wizard.js')
var dasboard_post = require('./functions/dashboard_post.js')
var dashboard_update = require('./functions/dashboard_update.js')
var dashboard_fetch = require('./functions/dashboard_fetch.js')
var dashboard_single_fetch = require('./functions/dashboard_single_fetch.js')
var okta_profile = require('./functions/okta/okta_profile.js')
var okta_users = require('./functions/okta/okta_users.js')
var okta_remove = require('./functions/okta/okta_remove.js')
var okta_user_groups = require('./functions/okta/okta_user_groups.js')
var okta_list_user_groups = require('./functions/okta/okta_list_user_groups.js')
var okta_user_group_remove = require('./functions/okta/okta_user_group_remove.js')
var okta_get_permissions = require('./functions/okta/okta_get_permissions.js')
var okta_update_permissions = require('./functions/okta/okta_update_permissions.js')

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var whitelist = ['http://localhost:3000', 'https://app.logicioe.com', 'https://dev.logicioe.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

// Production
// var proxy = require('redbird')({port: 443, ssl: {
//                 port: 3001,
//                 key: '/usr/share/logic/public/ssl/key.pem',
//                 cert: '/usr/share/logic/public/ssl/cert.pem',
//         }});
//
// proxy.register("https://logicioe.com/data", "http://localhost:3002/data");

// Development
var proxy = require('redbird')({
  port: 443,
  ssl: {
    port: 3003,
    key: './ssl/key.pem',
    cert: './ssl/cert.pem',
  }
});

proxy.register("https://logicioe.com/data-dev", "http://localhost:3001/data-dev");

app.get('/data-dev', async function (req, res) {
  switch (req.headers.function) {
    case "data":
      device_data.data.get_data(req, res);
      break;
    case "directordata":
      director_hosts.data.get_data(req, res);
      break;
    case "jira":
      jira_data.data.get_data(req, res);
      break;
    case "services":
      get_services.data.get_data(req, res);
      break;
    case "alarms":
      get_alarms.data.get_data(req, res);
      break;
    case "device":
      get_devices.data.get_data(req, res);
      break;
    case "check":
      check_now.data.post_data(req, res);
      break;
    case "postservices":
      update_director_services.data.post_data(req, res);
      break;
    case "posthosts":
      update_director_hosts.data.post_data(req, res);
      break;
    case "addhost":
      add_host.data.post_data(req, res);
      break;
    case "deploy":
      director_deploy.data.post_data(req, res);
      break;
    case "deletehost":
      director_delete_host.data.delete_data(req, res);
      break;
    case "incidents_chart":
      incidents_chart.data.get_data(req, res);
      break;
    case "templates":
      get_templates.data.get_data(req, res);
      break;
    case "hostgroupsstatus":
      host_group_status.data.get_data(req, res);
      break;
    case "sla":
      sla_graph.data.get_data(req, res);
      break;
    case "vars":
      get_icinga_vars.data.get_data(req, res);
      break;
    case "wizarddevices":
      dashboard_devices_wizard.data.get_data(req, res);
      break;
    case "wizardservices":
      dashboard_services_wizard.data.get_data(req, res);
      break;
    case "postdashboard":
      dasboard_post.data.post_data(req, res);
      break;
    case "updatedashboard":
      dashboard_update.data.post_data(req, res);
      break;
    case "fetchdashboards":
      dashboard_fetch.data.get_data(req, res);
      break;
    case "fetchsingledashboard":
      dashboard_single_fetch.data.get_data(req, res);
      break;
    case "okta_profile":
      okta_profile.data.update_data(req, res);
      break;
    case "okta_users":
      okta_users.data.update_data(req, res);
      break;
    case "okta_remove":
      okta_remove.data.update_data(req, res);
      break;
    case "okta_user_groups":
      okta_user_groups.data.get_data(req, res);
      break;
    case "okta_list_user_groups":
      okta_list_user_groups.data.get_data(req, res);
      break;
    case "okta_user_group_remove":
      okta_user_group_remove.data.update_data(req, res);
      break;
    case "okta_get_permissions":
      okta_get_permissions.data.get_data(req, res);
      break;
    case "okta_update_permissions":
      okta_update_permissions.data.update_data(req, res);
      break;
  }
})

// Production
// app.listen(3002);

// Development
// app.listen(3004);

// Local Development
app.listen(3001);