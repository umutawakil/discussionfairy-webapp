const assert               = require('chai').assert

var errorMode = false

module.exports.setErrorMode = function(x){
  errorMode = x
}

module.exports.createPlatformEndpoint = function(params,callback){

  assert(params.PlatformApplicationArn && params.Token,"Invalid request for createPlatfomEndpoint")

  var response = {
      EndpointArn: "xxxxxxx"
  }
  callback(errorMode,response)
}


module.exports.createTopic = function(params,callback){

  assert(params.Name,"Invalid request for createTopic")

  var response = {
      TopicArn: "xxxxxxx"
  }
  callback(errorMode,response)
}

module.exports.subscribe = function(params,callback){
  assert(params.Protocol ==="application" && params.TopicArn && params.Endpoint,"Invalid request for subscribe")

  var response = {
      SubscriptionArn: "xxxxxxx"
  }
  callback(errorMode,response)
}

module.exports.unsubscribe = function(params,callback){

  assert(params.SubscriptionArn,"Invalid request for unsubscribe")

  var response = {
      SubscriptionArn: "xxxxxxx"
  }
  callback(errorMode,response)
}

module.exports.publish = function(params,callback){
  assert(params.Message && params.MessageStructure ==="json" && params.TopicArn,"Invalid request for publish")

  var response = {
      SubscriptionArn: "xxxxxxx"
  }
  callback(errorMode,response)
}
