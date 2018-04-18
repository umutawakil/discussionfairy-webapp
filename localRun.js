//This scaffolding module is used to run the app locally with HTTPS
//It attempts to run the app with the same role that would be used in the cloud
//It requires that your local or current aws credentials have the ability to assume that role (application-test-user) and have no other privileges

console.log("Local RUN...")

const AWS          = require("aws-sdk")
const STSBuilder   = require('aws-sdk/clients/sts')
const sts          = new STSBuilder({'region': 'us-east-1'})
const fs           = require('fs')
const https        = require('https')
const http         = require('http')
const localSecrets = require('./local-secrets.json')
const logger       = require("./shared/logger.js")
const settings     = require("./settings.json")

//Ensure that ~/.aws/credentials contains no [default]. You must then set the access key and secret key to the creds of a blank user
// that has not privileges other than that they can assume the same role as the application
process.env.AWS_ACCESS_KEY_ID     = localSecrets.AWS_ACCESS_KEY_ID
process.env.AWS_SECRET_ACCESS_KEY = localSecrets.AWS_SECRET_ACCESS_KEY

initSystem()

function initSystem(){
  assumeApplicationRole().then(()=>{
    initApp()
  })
}

function assumeApplicationRole(){
    var params = {
    RoleArn: 'arn:aws:iam::842364697088:role/lambda-execution-role',
    RoleSessionName: 'SessionID',
    DurationSeconds: 3600
  }
  var promise = new Promise((resolve,reject) => {
    sts.assumeRole(params, function(err, data) {
      if (err) {
        console.log(err, err.stack)
        reject(err)
      } else {
        var o = {}
        process.env.DomainName            = "10.0.0.161:3000"//"localhost:3000"
        process.env.AWS_ACCESS_KEY_ID     = data.Credentials.AccessKeyId
        process.env.AWS_SECRET_ACCESS_KEY = data.Credentials.SecretAccessKey
        process.env.AWS_SESSION_TOKEN     = data.Credentials.SessionToken
        process.env.AWS_REGION            = 'us-east-1'
        process.env.AWS_DEFAULT_REGION    = 'us-east-1'
        resolve()
      }
    })
  })
  return promise
}

function initApp(){
  const app   = require('./app').app

  //The listeners below shouldn't be used in prod thanks to Lambda
  var privateKey = fs.readFileSync( 'private-ssl-key.pem')
  var certificate = fs.readFileSync( 'public-ssl-cert.crt')
  https.createServer({
      key: privateKey,
      cert: certificate
  }, app).listen(3000, function(){
    console.log('Example app listening on port 3000')
  })

  http.createServer(function(req,res){
    res.writeHead(302, {
    'Location': settings.url+req.url
    //add other headers here...
    });
    res.end();
  }).listen(8080)

}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
})

process.on('unhandledRejection', (reason, p) => {
  logger.logX('Unhandled Rejection at: Promise'+p+", "+reason+":, "+reason)
});

process.on('uncaughtException', (err,p) => {
  logger.logX("UNCAUGHT EXCEPTION: ",err)
})
