const utilities             = require('../shared/utilities')
//const AWS                   = require("aws-sdk")
//const CloudformationBuilder = require('aws-sdk/clients/cloudformation')
//let   cloudformation        = new CloudformationBuilder({'region': 'us-east-1'})
const container             = require("../dependency_injection/container").init()
const cloudformation        = container.services.Cloudformation

const settings              = require("../settings.json")
const logger                = require("../shared/logger.js")

module.exports.setCloudformation = function(x){
  cloudformation = x
}
module.exports.getCloudformation = function(){
  return cloudformation
}

module.exports.retrieveExternalConfigurations = function() {
  var stacksNames       = ["configuration", "cdn","iam","rds"]
  var stackDescriptions = stacksNames.map(function(x){
    return createEnvironmentVariablesFromStack(x)
  })
  return Promise.all(stackDescriptions)
}

function createEnvironmentVariablesFromStack(stackName){
  var params = {
   StackName: stackName
  }

  var promise = new Promise(function(resolve,reject){
    cloudformation.describeStacks(params, function(err, data) {
      if (err) {
        logger.logX("Configuration Retrieval Error",err)
        throw err
        //reject(err)
      } else {
        console.log("Outputs: "+data.Stacks[0].Outputs.length)
        data.Stacks[0].Outputs.forEach(function(x){
          //console.log(x.OutputKey+": "+x.OutputValue)
          if(!((x.OutputKey === "DomainName") && process.env.DomainName)) {
            console.log(x.OutputKey+": "+x.OutputValue)
            process.env[x.OutputKey]= x.OutputValue
          } else {
            console.log("LOCAL DOMAIN NAME: "+process.env.DomainName)
          }
        })
        resolve(data)
      }
    });
  })
  return promise
}
