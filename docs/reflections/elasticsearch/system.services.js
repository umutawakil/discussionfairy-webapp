const utilities            = require('../shared/utilities')
const AWS                  = require("aws-sdk")
const DynamoDB             = require('aws-sdk/clients/dynamodb')
const dynamodb             = new DynamoDB({'region': 'us-east-1'})
const logger               = require("../shared/logger.js")
const settings             = require("../settings.json")
const configurationService = require("../services/configuration.services.js")
const sqlUtility           = require("../utilities/sql.utility.js")
let options             = {
  hosts: [process.env.ESEndPointURL], // array of amazon es hosts (required)
  connectionClass: require('http-aws-es'), // use this connector (required)
  awsConfig: new AWS.Config({region:'us-east-1'})
}
const elasticSearch     = require('elasticsearch').Client(options)

module.exports.generalInfo = function(input) {
  if(process.env.RecordingSourceURL) {
    return getGeneralInfo()
  }
  return initSystemConfigurationThenGeneralInfo()
}

function getGeneralInfo(){
  var data = {}
  data.recordingSourceURL = process.env.RecordingSourceURL
  data.recordingUploadURL = process.env.RecordingUploadURL
  data.minIOSVersion      = settings.minIOSVersion
  var promise = new Promise(function(resolve,reject){
    resolve(data)
  })
  return promise
}

//TODO: This is because of cold starts
function initSystemConfigurationThenGeneralInfo(){
  return configurationService.retrieveExternalConfigurations().then(()=>{
    return getGeneralInfo()
  })
}

module.exports.initializeSchemaIfNeeded = function(){
  sqlUtility.createConnectionPool()
  /*checkIfESIndexExists().
  then(result =>{
    if(!result){
      createSchema()
      return
    }
  })*/
}



function checkIfESIndexExists() {
  var promise = new Promise(function(resolve,reject){
    var params = {
      index:settings.elasticSearchIndex
    }

    elasticSearch.indices.exists(params,function(error,response){
        if(error){
          logger.logX("Error on index initialization",error)
          throw error
          //reject(error)
          return
        }
        if(response === false){
          resolve(false)
        } else if (response === true){
          resolve(true)
        } else {
          //TODO: This needs to be handled better
          console.log("Unknown value for index check: "+response)
          //resolve(false)
          throw new Error("Unknown value for index check: ")
        }
    })
  })
  return promise
}

function createSchema() {
  var promise = new Promise(function(resolve,reject){

          var params = {
            index:settings.elasticSearchIndex,
            body:{
              mappings: {
                discussion: {
                  _all: { enabled: false},
                  properties:{
                    likes:{
                      type: "integer",
                      index: "not_analyzed"
                    },
                    timestamp:{
                      type: "long",
                      index: "not_analyzed"
                    },
                    lastNewModifierTimestamp: {
                      type: "long",
                      index: "not_analyzed"
                    },
                    lastModificationTimestamp: {
                      type: "long",
                      index: "not_analyzed"
                    },
                    language: {
                      type: "string",
                      index: "not_analyzed"
                    },
                    location:{
                      type: "string",
                      index: "not_analyzed"
                    },
                    keywords:{
                      type: "string",
                      index: "not_analyzed"
                    },
                    displayKeywords:{
                      type: "string",
                      index: "not_analyzed"
                    }
                  }
                },
                keyword: {
                  _all: { enabled: false},
                  properties:{
                    name: {
                      type: "string",
                      index: "not_analyzed"
                    },
                    displayName: {
                      type: "string",
                      index: "not_analyzed"
                    },
                    children: {
                      type: "integer",
                      index: "not_analyzed"
                    },
                    timestamp:{
                      type: "long",
                      index: "not_analyzed"
                    },
                    lastNewModifierTimestamp: {
                      type: "long",
                      index: "not_analyzed"
                    },
                    lastModificationTimestamp: {
                      type: "long",
                      index: "not_analyzed"
                    },
                    language: {
                      type: "string",
                      index: "not_analyzed"
                    },
                    location:{
                      type: "string",
                      index: "not_analyzed"
                    },
                  }
                },
                discussionUpdate: {
                  properties: {
                    timestamp:{
                      type: "long",
                      index: "not_analyzed"
                    }
                  }
                }
              }
            }
          }

          elasticSearch.indices.create(params,function(error,response){
              if(error){
                //reject(error)
                throw error
              }

              if(response.error){
                throw new Error(response.error)
              }
              //console.log(response)
              resolve(response)
          })

  })
  return promise
}

module.exports.clearESDatabase = function() {
  var promise = new Promise(function(resolve,reject){
    elasticSearch.indices.delete({index:'_all'},function(error,response){
        if(error){
          reject(error)
          return
        }
        console.log(JSON.stringify(response))
        resolve(response)
    })
  })
  return promise
}
