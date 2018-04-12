const snsService      = require("../services/sns.services")
const dynamoDBService = require("../services/dynamodb.services")

module.exports.getPushRegistration = function(userId){
  var data = {
    userId: userId
  }
  return dynamoDBService.simpleObjectGet(data,"sns_registrations")
}

module.exports.publish = function(functionName,msg,topic){
    return snsService[functionName](msg,topic.topicARN)
}

module.exports.getTopic = function(discussionId){
  var key = {
    discussionId: discussionId
  }
  return dynamoDBService.simpleObjectGet(key,"sns_topics")
}

module.exports.unsubscribe = function(userId,topic){
  return module.exports.getSubscription(userId,topic).then(s => {
    return snsService.unsubscribe(s.subscriptionARN)
  })
}

module.exports.getSubscription= function(userId,topic) {
    var key = {
      userId: userId,
      topicARN:topic.topicARN
    }
    return dynamoDBService.simpleObjectGet(key,"sns_subscriptions")
}

module.exports.subscribe = function(registration,topic){
    return snsService.subscribe(topic.topicARN,registration.endpointARN)
}
