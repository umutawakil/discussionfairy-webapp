const AWS               = require("aws-sdk")
const DynamoDB          = require('aws-sdk/clients/dynamodb')
let   dynamodb          = new DynamoDB({'region': 'us-east-1'})
const utilities         = require("../shared/utilities.js")
const dynamodbDecision  = require("../decisions/dynamodb.decisions.js")
const ApplicationError  = require("../types/responses/application.error.js")
const IPromise          = require("../types//responses/i.promise.js")

module.exports.setDynamoDB = function(x){
  dynamodb = x
}

module.exports.getDynamoDB = function(){
  return dynamodb
}

module.exports.simpleObjectSave = function(object,storageLocation) {
  console.log("SIMPLE_OBJECT_SAVE: "+JSON.stringify(object))
  var params = {
    Item: DynamoDB.Converter.marshall(object),
    TableName: storageLocation
  }

  var resolve,reject;
  var promise = new Promise((x,y)=>{
    resolve=x;
    reject=y;
  })

  var callback = dynamodbDecision.standardCallback(resolve,reject)
  dynamodb.putItem(params,callback)
  return promise
}

module.exports.simpleObjectGet = function(key,storageLocation){
  var params = {
                Key: DynamoDB.Converter.marshall(key),
                TableName: storageLocation
  }

  var resolve,reject;
  var promise = new Promise((x,y)=>{
    resolve=x;
    reject=y;
  })

  var callback = dynamodbDecision.standardCallback(resolve,reject)
  dynamodb.getItem(params,callback)

  return promise.then(item=>{
    console.log("ITEM: "+JSON.stringify(item))
    return dynamodbDecision.formatGetItemResponse(item)
  })
}

module.exports.simpleObjectDelete = function(key,storageLocation){
  var params = {
                Key: DynamoDB.Converter.marshall(key),
                TableName: storageLocation
  }

  var resolve,reject;
  var promise = new Promise((x,y)=>{
    resolve=x;
    reject=y;
  })

  var callback = dynamodbDecision.standardCallback(resolve,reject)
  dynamodb.deleteItem(params, callback)

  return promise
}

/*module.exports.getInbox = function(userId) {
  var params = {
    ExpressionAttributeValues: {
      ':u': {S: userId}
    },
    KeyConditionExpression: 'userId = :u',
    IndexName: "creation_date_index",
    ScanIndexForward: false,
    TableName: "inbox_discussion_update",
  }

  var ip = new IPromise()
  dynamodb.query(params,dynamodbDecision.multipleResultsCallback(ip.resolve,ip.reject))

  return ip.promise
}

module.exports.countInbox = function(userId) {
 //'discussionId = :d and #ts < :t'
  var params = {
    ExpressionAttributeValues: {
      ':u': {S: userId}
    },
    KeyConditionExpression: 'userId = :u',
    IndexName: "creation_date_index",
    TableName: "inbox_discussion_update"
  }

  var ip = new IPromise()
  dynamodb.query(params, dynamodbDecision.countInboxCallback(ip.resolve,ip.reject))

  return ip.promise
}*/

module.exports.getComments = function(discussionId) {
 //'discussionId = :d and #ts < :t'
 //'discussionId = :d and #ts < :t'
  var params = {
    ExpressionAttributeValues: {
      ':d': {S: discussionId.toLowerCase()},
      ':t' : {N: new Date().getTime().toString()}
     },
     ExpressionAttributeNames: {
       '#ts': 'timestamp',
     },
      KeyConditionExpression: 'discussionId = :d AND #ts < :t',
      TableName: "reply"
  }

  var ip = new IPromise()
  dynamodb.query(params, dynamodbDecision.multipleResultsCallback(ip.resolve,ip.reject))

  return ip.promise
}
