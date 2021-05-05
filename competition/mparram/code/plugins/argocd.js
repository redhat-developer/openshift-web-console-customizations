var https = require('https');
var fs = require('fs');
const { spawn } = require('child_process');
module.exports = {
    run: function(acn, token, cb){
        const argocdapplications = {
            hostname: process.env.KUBERNETES_PORT_443_TCP_ADDR,
            port: 443,
            path: '/apis/argoproj.io/v1alpha1/namespaces/' + acn.spec.plugin.argocd.namespace[0] + '/applications/',
            rejectUnauthorized: false,  
            headers: {
               Authorization: 'Bearer ' + token
            }
        };
        https.get(argocdapplications, function(res){
            var body = '';
            res.on('data', function(chunk){
                body += chunk;
            });
            res.on('end', function(){
              var response = JSON.parse(body);
              var appsArray = response.items;
              var statusObj = {};
              appsArray.forEach(app => {
                statusObj["total"] = (statusObj["total"]+1) || 1 ;
                statusObj[app.status.health.status] = (statusObj[app.status.health.status]+1) || 1 ;
              });
              acn.spec.consolenotification.text = acn.spec.consolenotification.text.replace("$argocd-text$", JSON.stringify(statusObj).replace('{','').replace('}','').replace(/,/g,'  -  ').replace(/:/g,': ') + "  ");
              var template = "template_" + Math.floor(Math.random() * (9999- 1111) + 1111);
              var consolenotificationyaml = `apiVersion: console.openshift.io/v1
kind: ConsoleNotification
metadata:
  name: ` + acn.spec.consolenotification.name + `
spec:
  text: '` + acn.spec.consolenotification.text + `'
  location: ` + acn.spec.consolenotification.location + `
  link:
    href: '`+ acn.spec.consolenotification.link.href + `'
    text: ` + acn.spec.consolenotification.link.text + `
  color: '` + acn.spec.consolenotification.color + `'
  backgroundColor: '` + acn.spec.consolenotification.backgroundColor + `'`;
              fs.writeFileSync(template,  consolenotificationyaml);
              const oc = spawn('oc', ['apply', '-f', template]);

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
            });
        });
    }
}