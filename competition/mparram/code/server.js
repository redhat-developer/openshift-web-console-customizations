var https = require('https');
var CronJob = require('cron').CronJob;
const tokenpath = "/var/run/secrets/kubernetes.io/serviceaccount/token";
var fs = require('fs');
var token = fs.readFileSync(tokenpath,'utf8');
const { spawn } = require('child_process');
const acnconnection = {
  hostname: process.env.KUBERNETES_PORT_443_TCP_ADDR,
  port: 443,
  path: '/apis/console.openshift.io/v1/apiconsolenotifications/',
  rejectUnauthorized: false,  
  headers: {
     Authorization: 'Bearer ' + token
  }
};
var job = new CronJob('0 * * * * *', function() {
  https.get(acnconnection, function(res){
      var body = '';
      res.on('data', function(chunk){
          body += chunk;
      });
      res.on('end', function(){
          var response = JSON.parse(body);
          var acnArray = response.items;
          acnArray.forEach(acn => {
            https.get(acn.spec.endpoint.url, function(res){
              var body = '';
              res.on('data', function(chunk){
                  body += chunk;
              });
              res.on('end', function(){
                  var response = JSON.parse(body);
                  var streamer = jsonPathToValue(response, acn.spec.JSONPath);
                  if (streamer !== "0") {
                      var existcn;
                      const consolenotificationcheck = {
                        hostname: process.env.KUBERNETES_PORT_443_TCP_ADDR,
                        port: 443,
                        path: '/apis/console.openshift.io/v1/consolenotifications/' + acn.metadata.name,
                        rejectUnauthorized: false,  
                        headers: {
                           Authorization: 'Bearer ' + token
                        }
                      };
                      https.get(consolenotificationcheck, function(res){
                        var body = '';
                        res.on('data', function(chunk){
                            body += chunk;
                        });
                        res.on('end', function(){
                            existcn = JSON.parse(body);

                            if (existcn.status == "Failure"){
                              var template = "template_" + Math.floor(Math.random() * (9999- 1111) + 1111);
                              var consolenotificationyaml = `apiVersion: console.openshift.io/v1
kind: ConsoleNotification
metadata:
  name: ` + acn.spec.consolenotification.name + `
spec:
  text: ` + acn.spec.consolenotification.text + `
  location: ` + acn.spec.consolenotification.location + `
  link:
    href: '`+ acn.spec.consolenotification.link.href + `'
    text: ` + acn.spec.consolenotification.link.text + `
  color: '` + acn.spec.consolenotification.color + `'
  backgroundColor: '` + acn.spec.consolenotification.backgroundColor + `'`;
                              fs.writeFileSync(template,  consolenotificationyaml);
                              const oc = spawn('oc', ['create', '-f', template]);

                              oc.stdout.on('data', (data) => {
                                console.log(`stdout: ${data}`);
                              });
                              oc.stderr.on('data', (data) => {
                                console.error(`stderr: ${data}`);
                              });
                              oc.on('close', (code) => {
                                fs.unlink(template, (err) => {
                                  if (err) {
                                    console.error(err);
                                    return;
                                  }
                                });
                              });
                            }
                        });
                      });
                      
                  } else{
                      var existcn;
                      const consolenotificationcheck2 = {
                        hostname: process.env.KUBERNETES_PORT_443_TCP_ADDR,
                        port: 443,
                        path: '/apis/console.openshift.io/v1/consolenotifications/' + acn.metadata.name,
                        rejectUnauthorized: false,  
                        headers: {
                           Authorization: 'Bearer ' + token
                        }
                      };
                      https.get(consolenotificationcheck2, function(res){
                        var body = '';
                        res.on('data', function(chunk){
                            body += chunk;
                        });
                        res.on('end', function(){
                            existcn = JSON.parse(body);

                            if (existcn.status != "Failure"){
                              const oc = spawn('oc', ['delete', 'consolenotification', acn.spec.consolenotification.name]);
                              oc.stdout.on('data', (data) => {
                                console.log(`stdout: ${data}`);
                              });
                              
                              oc.stderr.on('data', (data) => {
                                console.error(`stderr: ${data}`);
                              });
                            }
                        });
                      });
                      
                  }
              });
            }).on('error', function(err){
                console.log("Got an error: ", err);
            });
          });

      });
  }).on('error', function(err){
        console.log("Got an error: ", err);
  });
});

job.start();

function jsonPathToValue(jsonData, path) {
  if (!(jsonData instanceof Object) || typeof (path) === "undefined") {
      throw InvalidArgumentException("jsonData:" + jsonData + ", path:" + path);
  }
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  var pathArray = path.split('.');
  for (var i = 0, n = pathArray.length; i < n; ++i) {
      var key = pathArray[i];
      if (key in jsonData) {
          if (jsonData[key] !== null) {
              jsonData = jsonData[key];
          } else {
              return null;
          }
      } else {
          return key;
      }
  }
  return jsonData;
}
