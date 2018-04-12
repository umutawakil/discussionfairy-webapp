const assert               = require('chai').assert

var errorMode = undefined;

var Mock = {}

Mock.createPlatformEndpoint = function(params,callback){

  //assert(params.PlatformApplicationArn && params.Token,"Invalid request for createPlatfomEndpoint")

  var response = {
      EndpointArn: "xxxxxxx"
  }
  callback(errorMode,response)
}


Mock.createTopic = function(params,callback){

  //assert(params.Name,"Invalid request for createTopic")

  var response = {
      TopicArn: "xxxxxxx"
  }
  callback(errorMode,response)
}

Mock.subscribe = function(params,callback){
  //assert(params.Protocol ==="application" && params.TopicArn && params.Endpoint,"Invalid request for subscribe")

  var response = {
      SubscriptionArn: "xxxxxxx"
  }
  callback(errorMode,response)
}

Mock.unsubscribe = function(params,callback){
  var response = {
      SubscriptionArn: "xxxxxxx"
  }
  callback(errorMode,response)
}

Mock.publish = function(params,callback){
  //assert(params.Message && params.MessageStructure ==="json" && params.TopicArn,"Invalid request for publish")

  var response = {
      SubscriptionArn: "xxxxxxx"
  }
  callback(errorMode,response)
}

module.exports = function(){
  return Mock
}
