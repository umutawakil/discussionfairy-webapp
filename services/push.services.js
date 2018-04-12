const snsService            = require("../services/sns.services")
const dynamoDBService       = require("../services/dynamodb.services")
const utilities             = require("../shared/utilities")
const pushUtility           = require("../utilities/push.utilities")
const SNSCreateTopicRequest = require("../types/sns/create.topic.type")

module.exports.apnsRegister = function(userId,deviceToken) {
  return snsService.createPlatformEndpoint(process.env.APNSApplicationARN,deviceToken).then((r)=>{
    const data = {
        userId: userId,
        deviceToken: deviceToken,
        endpointARN: r.EndpointArn,
        type: "apns"
    }
    return dynamoDBService.simpleObjectSave(data,"sns_registrations")
  })
}

module.exports.gcmRegister = function(userId,deviceToken) {
  return snsService.createPlatformEndpoint(process.env.GCMApplicationARN,deviceToken).then((r)=>{
    const data = {
        userId: userId,
        deviceToken: deviceToken,
        endpointARN: r.EndpointArn,
        type: "gcm"
    }
    return dynamoDBService.simpleObjectSave(data,"sns_registrations")
  })
}

/*module.exports.createTopic = function(discussionId){
  const types = ["apns","gcm"]
  var configs = types.map(t=>{
    return {type:t,name:discussionId+"_"+t}
  })

  console.log(JSON.stringify(configs))

  var results = configs.map(c =>{
    return snsService.createTopic(new SNSCreateTopicRequest(c.name)).then(t=>{
      var topicInfo = {
        discussionId: discussionId,
        topicARN: t.TopicArn,
        type: c.type
      }
      return dynamoDBService.simpleObjectSave(topicInfo,"sns_topics")
    })
  })

  return Promise.all(results)
}*/
module.exports.createTopic = function(discussionId){
    return snsService.createTopic(new SNSCreateTopicRequest(discussionId)).then(t=>{
      var topicInfo = {
        discussionId: discussionId,
        topicARN: t.TopicArn
      }
      return dynamoDBService.simpleObjectSave(topicInfo,"sns_topics")
    })
}

//TODO: Expression
module.exports.subscribeToDiscussion = function(userId,discussionId) {
  return pushUtility.getPushRegistration(userId).then(r=>{
    if(!r){
      return
    }
    var key = {
      discussionId:discussionId
    }
    return dynamoDBService.simpleObjectGet(key,"sns_topics").then(t =>{
        return snsService.subscribe(t.topicARN,r.endpointARN).then(s =>{
            var data = {
              userId: userId,
              subscriptionARN: s.SubscriptionArn,
              topicARN:t.topicARN
            }
            return dynamoDBService.simpleObjectSave(data,"sns_subscriptions")
        })
    })
  })
}

/*module.exports.subscribeToDiscussion = function(userId,discussionId) {
  return pushUtility.getPushRegistration(userId).then(r=>{
    if(!r){
      return
    }
    var key = {
      discussionId:discussionId,
      type:r.type
    }
    return dynamoDBService.simpleObjectGet(key,"sns_topics").then(t =>{
        return snsService.subscribe(t.topicARN,r.endpointARN).then(s =>{
            var data = {
              userId: userId,
              subscriptionARN: s.SubscriptionArn,
              topicARN:t.topicARN
            }
            return dynamoDBService.simpleObjectSave(data,"sns_subscriptions")
        })
    })
  })
}*/

//TODO: Needs unit test
module.exports.unsubscribe = function(userId,discussionId) {
  return pushUtility.getPushRegistration(userId).then(r=>{
    if(!r){
      return
    }
    let key = {
      discussionId:discussionId
    }
    return dynamoDBService.simpleObjectGet(key,"sns_topics").then(t=>{
        let key = {
          userId: userId,
          topicARN:t.topicARN
        }
        return dynamoDBService.simpleObjectGet(key,"sns_subscriptions").then(s => {
          return snsService.unsubscribe(s.subscriptionARN)
        })

    })
  })
}

module.exports.sendNewCommentNotifications = function(userId,discussionId) {
  var      message = "Someone has replied in your discussion #"+utilities.toTitleCase(discussionId)
  var registration = pushUtility.getPushRegistration(userId)

  return Promise.all([
    sendNotification(userId,discussionId,message,registration)//,
    //sendNotificationType(userId,discussionId,message,registration,"gcm","publishGCMMessageToTopic")
  ])
}

//If user is subscribed then unsubscribed them, broadcast the message then resubscribe them else publish the Message
//then subscribe them. If the user has no registration then just publish the message.
function sendNotification(userId,discussionId,msg,registration) {
  return pushUtility.getTopic(discussionId).then(topic=>{
    console.log("Attempting to publish")
    return registration.then(r=>{
      if(r){
        return pushUtility.unsubscribe(userId,topic).then(()=>{
          console.log("Publishing A")
            return pushUtility.publish("publishMessageToTopic",msg,topic)
        }).then(()=>{
          console.log("Not Publishing")
            return pushUtility.subscribe(r,topic)
          })

      } else {
        console.log("Publishing B: "+JSON.stringify(topic))
        return pushUtility.publish("publishMessageToTopic",msg,topic)
      }
    })
  })
}
