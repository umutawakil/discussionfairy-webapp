const dynamoDBServcie = require("../services/dynamodb.services")

module.exports.getFromKVStore = function(objectName){
    var key ={
      objectName: objectName
    }
    return dynamoDBServcie.simpleObjectGet(key,"keyValueStore")
    /*var params = {
                 Key: {
                  objectName: {S: objectName}
                 },
                 TableName: "keyValueStore"
    }

    var promise = new Promise(function(resolve,reject){
      dynamodb.getItem(params, function(err, data) {
          if (err) {
            reject(err)
          }  else {
            if(data.Item){
              resolve(DynamoDB.Converter.unmarshall(data.Item).object)
            } else {
              resolve()
            }
          }
      })
    })
    return promise*/
}

module.exports.saveToKVStore = function(objectName,object){
    var data = {
      objectName: objectName,
      object: object,
      timestamp: new Date().getTime()
    }
    return dynamoDBServcie.simpleObjectSave(data,"keyValueStore")
    /*var params = {
                 Item: {
                  objectName:  {S:objectName},
                  object: {S: object},
                  timestamp: {N: new Date().getTime().toString()}
                 },
                 TableName: "keyValueStore"
    }

    var promise = new Promise(function(resolve,reject){
      dynamodb.putItem(params, function(err, data) {
          if (err) {
            reject(err)
          }  else {
            resolve(object)
          }
      })
    })
    return promise*/
}
