//const SNSCreator            = require('aws-sdk/clients/sns')
//let   sns                   = new SNSCreator({'region': 'us-east-1'});
const container             = require("../dependency_injection/container").init()
const sns                   = container.services.Sns
const snsDecision           = require("../decisions/sns.decisions.js")
const SNSCreateTopicRequest = require("../types/sns/create.topic.type")
const ApplicationError      = require("../types/responses/application.error")

//TODO: Dependency Injection Framework
/*module.exports.setSNS = function(x){
  sns = x
}

module.exports.getSNS = function(x){
  return sns
}*/

module.exports.createPlatformEndpoint = function(applicationARN,deviceToken){
  var params = {
    PlatformApplicationArn: applicationARN,
    Token: deviceToken
  }
  return promisifyFunctionCall(sns,"createPlatformEndpoint",params)
}

/*module.exports.publishAPNSMessageToTopic = function(msg,topicARN) {
  var payload = {default:msg}
  payload[process.env.APNSEnvironment] = {
      aps: {
        alert: msg,
        sound: 'default',
        badge: 1
      }
  }

  payload[process.env.APNSEnvironment] = JSON.stringify(payload[process.env.APNSEnvironment]);
  payload = JSON.stringify(payload);

  var params = {
    Message: payload,
    MessageStructure: 'json',
    TopicArn: topicARN
  }
  return publish(params)
}*/

module.exports.publishMessageToTopic = function(msg,topicARN) {
  var payload = {default:msg}
  payload[process.env.APNSEnvironment] = JSON.stringify(createAPNSPayload(msg));
  payload["GCM"]                       = JSON.stringify(createGCMPayload(msg));
  var payloadString                    = JSON.stringify(payload);

  console.log("GCM string: "+payload["GCM"]);
  console.log("Full SNS Message: "+payloadString);

  var params = {
    Message: payloadString,
    MessageStructure: 'json',
    TopicArn: topicARN
  }
  return publish(params)
}

function createGCMPayload(msg){
    return {
      data: {
        message:msg
      }
        /*notification: {
          title:"New Comment!",
          body:msg,
          icon:"myicon"
        }*/
    }
}
function createAPNSPayload(msg) {
  return {
      aps: {
        alert: msg,
        sound: 'default',
        badge: 1
      }
  }
}

module.exports.subscribe = function(topicARN,endpointARN){
  var params = {
    Protocol: "application",
    TopicArn: topicARN,
    Endpoint: endpointARN
  }
  return promisifyFunctionCall(sns,"subscribe",params)
}

module.exports.unsubscribe = function(subscriptionARN){
  console.log("UNSUBSCRIBE: "+subscriptionARN)
  var params = {
    SubscriptionArn: subscriptionARN
  }
  return promisifyFunctionCall(sns,"unsubscribe",params)
}

module.exports.createTopic = function(createTopicRequest){
  var validation = createTopicRequest.validate(SNSCreateTopicRequest)
  if(validation.valid){
    var params = {
      Name: createTopicRequest.name
    }
    return promisifyFunctionCall(sns,"createTopic",params)

  } else {
    return Promise.reject(new ApplicationError(validation.message))
  }

}


function publish(params){
  return promisifyFunctionCall(sns,"publish",params)
}

//TODO: The snsDecision logic could be standardized across AWS and this function used in the other AWS wrappers AWSDecision (for example) and AWSUtility
function promisifyFunctionCall(client,functionName,params){
  var resolve,reject;
  var promise = new Promise((x,y)=>{
    resolve=x;
    reject=y;
  })

  var callback = snsDecision.createStandardResponseCallback(resolve,reject)
  client[functionName](params,callback)

  return promise
}
