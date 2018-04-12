const utilities            = require('../shared/utilities')
const AWS                  = require("aws-sdk")
const DynamoDB             = require('aws-sdk/clients/dynamodb')
const dynamodb             = new DynamoDB({'region': 'us-east-1'})
const logger               = require("../shared/logger.js")
const settings             = require("../settings.json")
const configurationService = require("../services/configuration.services.js")
const keyValueService      = require("../services/keyvalue.services.js")
const rdsService           = require("../services/rds.services.js")
const fs                   = require('fs')
const path                 = require("path")
//let schemaInitialized      = false
let systemInitialized      = false

//TODO: This is a spiderweb of external dependencies. It might not be possible to simplify this

module.exports.setSystemInitialized = function(x) {
  systemInitialized = x
}

/*module.exports.setSchemaInitialized = function(x){
  schemaInitialized = x
}
module.exports.getSchemaInitialized = function(){
  return schemaInitialized
}*/

module.exports.generalInfo = function(input) {
  if(process.env.RecordingSourceURL) {
    return getGeneralInfo()
  }
  //TODO: This is because of cold starts
  return initSystemConfiguration().then(()=>{
    return getGeneralInfo()
  })
}

function getGeneralInfo(){
  var data = {}
  data.recordingSourceURL = process.env.RecordingSourceURL
  data.recordingUploadURL = process.env.RecordingUploadURL
  data.minIOSVersion      = settings.minIOSVersion
  data.minAndroidVersion  = settings.minAndroidVersion
  
  var promise = new Promise(function(resolve,reject){
    resolve(data)
  })
  return promise
}

/*module.exports.coldStartCheck = function() {
  if(!systemInitialized){
    return initSystemConfiguration()
  } else {
    console.log("System already initialized.")
    return Promise.resolve()
  }
}*/

module.exports.initSystemConfiguration = initSystemConfiguration
function initSystemConfiguration(){
  /*return  initializeS3VerificationSecret().then(()=>{
        return configurationService.retrieveExternalConfigurations()
    })*/

  if(systemInitialized) {
    console.log("System already Initialized")
    return Promise.resolve(true)
  }

  console.log("Initializing System Configuration...")
  return configurationService.retrieveExternalConfigurations().then(()=>{
    return initializeS3VerificationSecret()
  }).then(()=>{
    return initializeSchema()
  }).then(() => {
    systemInitialized = true
    return true
  }).catch(e=>{
    console.log(e)
  })
}

function initializeS3VerificationSecret(){
  //console.log("Initializing s3 verification secret....")
  return keyValueService.getFromKVStore("s3verificationSecret").then(secretKey=>{
    if(!secretKey){
      console.log("No S3 Verification Key detected so creating one")
      return keyValueService.saveToKVStore("s3verificationSecret",process.env.AWS_SECRET_ACCESS_KEY).then(()=>{
        process.env.S3_VERIFICATION_SECRET = process.env.AWS_SECRET_ACCESS_KEY
      }).catch(e=>{
        console.log(e)
      })
    } else {
      console.log("S3 Verification Key found")
      process.env.S3_VERIFICATION_SECRET = secretKey
      //console.log("S3_VERIFICATION_SECRET: "+process.env.S3_VERIFICATION_SECRET)
      return secretKey
    }
  }).catch(e=>{
    console.log(e)
  })
}

function initializeSchema(){
    rdsService.createConnectionPool()


  /*var currentPath = __dirname.toString()
  currentPath = currentPath.replace("services","")+"app.sql"

  var data = fs.readFileSync(currentPath).toString('utf-8')
  return rdsService.preparedStatement(data,[]).then(result=>{
    if(result.isFail()){
      console.log(result.fail().message)
      console.log(result.fail().error)
    }
  }).catch(e=>{
    console.log(e)
  })*/
}
