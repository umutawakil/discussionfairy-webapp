var BaseType = require("../base.type.js")

function SNSCreateTopicRequest(name){
  BaseType.apply(this,arguments)
  this.fields = ["name"]
  this.name  = name
}

SNSCreateTopicRequest.prototype = new BaseType()
SNSCreateTopicRequest.prototype.constructor = SNSCreateTopicRequest

module.exports = SNSCreateTopicRequest
