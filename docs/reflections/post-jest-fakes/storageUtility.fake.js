const assert               = require('chai').assert
var responseObject = {data:""}

module.exports.setResponseObject = function(x){
  responseObject = x
}
module.exports.setRegistrationObject = function(x){
  registration = x
}
module.exports.setTopicObject = function(x){
  topic = x
}
module.exports.setSubscriptionObject = function(x){
  subscription = x
}
module.exports.setInboxSubscriptions = function(x){
  inboxSubscriptions = x
}
var topic = {}
var registration = {}
var subscription = {}
var inboxSubscriptions = {}

module.exports.simpleObjectSave = function(object,storageLocation){
  validateObject(object,storageLocation,"simpleObjectSave")

  var promise = new Promise(function(resolve,reject){
    returnObject(resolve,storageLocation)
  })
  return promise
}

module.exports.simpleObjectGet = function(key,storageLocation,errorMessage){
  validateObject(key,storageLocation,"simpleObjectGet")
  var promise = new Promise(function(resolve,reject){
    returnObject(resolve,storageLocation)
  })
  return promise
}

function returnObject(resolve,storageLocation){
  if(storageLocation==="sns_registrations"){
    resolve(registration)
  }else if(storageLocation==="sns_topics") {
    resolve(topic)
  } else if(storageLocation==="sns_subscriptions"){
    resolve(subscription)
  } else if(storageLocation === "inbox_subscription") {
    resolve(inboxSubscriptions)
  } else {
    resolve(responseObject)
  }
}

module.exports.simpleObjectDelete = function(key,storageLocation){
  validateObject(key,storageLocation,"simpleObjectDelete")
  var promise = new Promise(function(resolve,reject){
    resolve(responseObject)
  })
  return promise
}

function validateObject(key,storageLocation,caller){
  if(storageLocation === "discussion") {
    assert(key.discussionId,"Invalid discussionId for discussion on "+caller)
    //throw new Error("Invalid discussionId")
  }
  if(storageLocation === "sns_registrations") {
    assert(key.userId,"Invalid userId for sns_registrations on "+caller)
  }
  if(storageLocation === "sns_subscriptions") {
    //throw new Error("Invalid userId or topicARN")
    assert(key.userId,"Invalid userId for sns_subscriptions on "+caller)
    assert(key.topicARN,"Invalid topicARN for sns_subscriptions on "+caller)
  }
  if(storageLocation === "sns_topics") {
    //throw new Error("Invalid discussionId or type")
    assert(key.discussionId,"Invalid discussionId for sns_topics on "+caller)
    assert(key.type,"Invalid type for sns_topics on "+caller)
  }
  if(storageLocation === "inbox_discussion_update"){
    assert(key.userId,"Invalid userId for inbox_discussion_update on "+caller)
    assert(key.discussionId,"Invalid discussionId for inbox_discussion_update on "+caller)
  }
}
