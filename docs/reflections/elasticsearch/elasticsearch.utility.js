const settings            = require("../settings.json")
const AWS                 = require("aws-sdk")
let options = {
  hosts: [process.env.ESEndPointURL], // array of amazon es hosts (required)
  connectionClass: require('http-aws-es'), // use this connector (required)
  awsConfig: new AWS.Config({region:'us-east-1'})
}
const elasticSearch       = require('elasticsearch').Client(options)

module.exports.get = function (inputId,objectType){
  var promise = new Promise(function(resolve,reject){

    var params = {
      index:settings.elasticSearchIndex,
      type: objectType,
      id: inputId
    }
    elasticSearch.get(params, function (error, response) {
        if(error){
          if(error.statusCode === 404) {
            resolve({})
            return
          }
          reject(error)
          return
        }
        //console.log(JSON.stringify(response))
        resolve(response._source)
    })
  })
  return promise
}
