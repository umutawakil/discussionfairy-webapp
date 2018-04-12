
const utilities                   = require("../shared/utilities.js")
const discussionUploadFormRequest = require("../types/discussion/upload.form.request.js")()
const settings                    = require("../settings.json")
const userDecisions               = require("../decisions/user.decisions.js")
const BadUserInput                = require("../types/responses/bad.user.input.js")
const UploadFormRequest           = require("../types/discussion/upload.form.request.js")
const discussionUtility           = require("../utilities/discussion.utilities")

module.exports.parseDiscussionUploadFormRequest = function(req){
    var reject,resolve
    var promise = new Promise((x,y)=>{
      resolve=x
      reject=y
    })

    if(!req){
     reject(new BadUserInput("No request to process"))
    } else if(!req.body){
       reject(new BadUserInput("No input discussion form to process"))
    } else {
      var formRequest = req.body
      formRequest.userId = req.userId

      console.log("Discussion Request: "+JSON.stringify(formRequest))

      var result = isUploadFormRequestValid(formRequest)
      if(result.invalid){
        reject(new BadUserInput(result.message))
      }else if(!utilities.checkAllPropertiesDefined(formRequest,new UploadFormRequest())){
        reject(new BadUserInput("require field(s) missing"));
      } else {
        resolve(addServerSideContextProperties(formRequest))
      }
    }
    return promise

}

function isUploadFormRequestValid(formRequest) {
  var result = {message: "", invalid: false}

  if(!formRequest){
    result.message = "No form data sent"
    result.invalid = true
    return result
  }

  if(!userDecisions.isUserIdFormatValid(formRequest.userId)){
      result.message = "Invalid userId"
      result.invalid = true
      return result
  }

  if(!isDiscussionIdValid(formRequest.discussionId)){
      result.message = "Invalid discussionId"
      result.invalid = true
      return result
  }
  if(!formRequest.keywords || !formRequest.keywords.every(isKeywordValid)){
    result.message = "Invalid keyword detected: "+JSON.stringify(formRequest.keywords)
    result.invalid = true
    return result
  }
  if(!isTitleValid(formRequest.discussionTitle)){
    result.message = "Invalid title detected: "+formRequest.discussionTitle
    result.invalid = true
    return result
  }
  if(!isLocationValid(formRequest.location)){
    result.message = "Invalid location detected: "+formRequest.location
    result.invalid = true
    return result
  }
  if(!isLanguageValid(formRequest.language)){
    result.message = "Invalid language detected: "+formRequest.language
    result.invalid = true
    return result
  }
  if(!isExtensionValid(formRequest.extension)){
    result.message = "Invalid extension detected: "+formRequest.extension
    result.invalid = true
    return result
  }
  if(!isReferenceLinkValid(formRequest.referenceLink)){
    result.message = "Invalid reference link: "+formRequest.referenceLink
    result.invalid = true
    return result
  }

  return result
}

function isReferenceLinkValid(x){
  return  true
}

function isExtensionValid(x) {
  if(!x || x.length <= 0 || x.length > settings.maxExtensionLength){
    return false
  }
  if(!settings.allowedExtensions.includes(x)){
    return false
  }
  return true
}
function isLocationValid(x) {
  if(!x || x.length <=0 || x.length > settings.maxLocationLength) {
    return false
  }
  return true
}
function isLanguageValid(x) {
  if(!x || x.length <=0 || x.length > settings.maxLanguageLength) {
    return false
  }
  return true
}
function isTitleValid(x) {
  if(!x || x.length <=0 || x.length > settings.maxTitleLength) {
    return false
  }
  return true
}
function isKeywordValid(x) {
  if(!x || x.length <=0 || x.length > settings.maxKeywordLength) {
    return false
  }
  return true
}
function isDiscussionIdValid(x) {
  if(!x || x.length <=0 || x.length > settings.maxDiscussionIdLength) {
    return false
  }
  return true
}

function addServerSideContextProperties(newDiscussionInfo){
  newDiscussionInfo.key                  = discussionUtility.createKey(newDiscussionInfo)
  newDiscussionInfo.displayDiscussionId  = newDiscussionInfo.discussionId
  newDiscussionInfo.discussionId         = newDiscussionInfo.discussionId.toLowerCase(),
  newDiscussionInfo.popularity           = 0
  newDiscussionInfo.likes                = 0
  newDiscussionInfo.dislikes             = 0
  newDiscussionInfo.comments             = 0
  newDiscussionInfo.creationTime         = new Date().getTime()/1000
  newDiscussionInfo.referenceLink        = newDiscussionInfo.referenceLink? newDiscussionInfo.referenceLink:undefined //should probably construct a new object here
  newDiscussionInfo.k1                   = newDiscussionInfo.keywords[0]
  newDiscussionInfo.k2                   = newDiscussionInfo.keywords[1]
  newDiscussionInfo.k3                   = newDiscussionInfo.keywords[2]

  //console.log("Keywords: "+JSON.stringify(newDiscussionInfo.keywords));
  //console.log("Keywords: "+JSON.stringify(newDiscussionInfo.k1));
  //console.log("Keywords: "+JSON.stringify(newDiscussionInfo.k2));
  //console.log("Keywords: "+JSON.stringify(newDiscussionInfo.k3));
  //newDiscussionInfo.updateTime           = new Date().getTime()
  return newDiscussionInfo
}
