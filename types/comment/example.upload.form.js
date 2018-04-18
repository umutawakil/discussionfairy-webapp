
var BaseType      = require("../base.type.js")
var userDecisions = require("../../decisions/user.decisions")
var settings      = require("../../settings.json")
var utilities     = require("../../shared/utilities")
//module.exports = CommentUploadRequest

var ExampleCommentUploadRequest = function(){
  BaseType.apply(this,arguments)
  this.fields = ["userId","discussionId","extension"]
}

ExampleCommentUploadRequest.prototype = new BaseType()
ExampleCommentUploadRequest.prototype.constructor = ExampleCommentUploadRequest

ExampleCommentUploadRequest.prototype.validate = function(){
  var result = BaseType.prototype.validate.apply(this,arguments)
  if(!result.valid){
    return result
  }

  return isUploadFormRequestValid(this)
}

function isUploadFormRequestValid(x) {
  var result = {message: "", valid: true}

  if(!userDecisions.isUserIdFormatValid(x.userId)){
      result.message = "Invalid userId"
      result.valid = false
      return result
  }

  if(!isDiscussionIdValid(x.discussionId)){
      result.message = "Invalid discussionId"
      result.valid = false
      return result
  }
  if(!isExtensionValid(x.extension)){
    result.message = "Invalid extension detected: "+x.extension
    result.valid = false
    return result
  }

  return result
}

function isExtensionValid(x) {
  if(!x || x.length <= 0 || x.length > settings.maxExtensionLength){
    return false
  }
  if(!settings.allowedExtensions.includes(x)){
    return false
  }
  return utilities.isURLSafe(x)
}

function isDiscussionIdValid(x) {
  if(!x || x.length <=0 || x.length > settings.maxDiscussionIdLength) {
    return false
  }
  return utilities.isURLSafe(x)
}

module.exports = ExampleCommentUploadRequest
