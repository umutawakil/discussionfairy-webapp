const AWS              = require("aws-sdk")
const DynamoDB         = require('aws-sdk/clients/dynamodb')
const dynamodb         = new DynamoDB({'region': 'us-east-1'})
const ApplicationError = require("../types/responses/application.error")

module.exports.standardCallback = function(resolve,reject){
  var callback = function(error,response){
    if(error){
      reject(new ApplicationError("dynamo error",error))
    }else if(!response){
      reject(new ApplicationError("dynamo error: undefined response"))

    } else if(response.error) {
      reject(new ApplicationError("dynamo error: nested error in response",response.error))
    } else {
      resolve(response)
    }
  }
  return callback
}

module.exports.multipleResultsCallback = function(resolve,reject){
  var callback = function(error,response){
    if (error) {
      reject(new ApplicationError("dynamodb error",error))
    }  else {
      if(response.Items){
        var cleaned = []
        response.Items.forEach(function(x){
          cleaned.push(DynamoDB.Converter.unmarshall(x))
        })
        resolve(cleaned)
      } else {
        resolve()
      }
    }
  }
  return callback
}

module.exports.formatGetItemResponse = function(response){
  if(response && response.Item){
    return DynamoDB.Converter.unmarshall(response.Item)
  }
  return undefined
}
