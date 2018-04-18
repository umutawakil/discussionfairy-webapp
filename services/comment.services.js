const utilities        = require('../shared/utilities')
const settings         = require("../settings.json")

const s3Decision       = require('../decisions/s3.decisions')
const dynamoDBDecision = require('../decisions/dynamodb.decisions')
const signatureUtility = require("../utilities/signature.utilities")

const dynamoDBService  = require('../services/dynamodb.services')
const searchService    = require("../services/search.services")
const pushService      = require('../services/push.services')
const inboxService     = require('../services/inbox.services')

/*module.exports.setDynamoDBService = function(x){
  dynamoDBService = x
}
module.exports.getDynamoDBService = function(){
  return dynamoDBService
}
module.exports.setInboxService    = function(x){
  inboxService = x
}
module.exports.getInboxService    = function(){
  return inboxService
}
module.exports.setSearchService   = function(x){
  searchService = x
}
module.exports.getSearchService   = function(){
  return searchService
}
module.exports.setPushService   = function(x){
  pushService = x
}
module.exports.getPushService   = function(){
  return pushService
}*/

module.exports.createUploadFormParameters = function(s3Input) {
  console.log("INPUT: "+JSON.stringify(s3Input))
    return s3Decision.createUploadFormParameters(s3Input)
}

module.exports.getComments = function(discussionId) {
  return dynamoDBService.getComments(discussionId)
}

module.exports.createNewCommentFromS3Response = function(discussionInfoEncoded,potentialSignature,s3VerificationSecret) {
  var discussionInfo         = JSON.parse(Buffer.from(discussionInfoEncoded, 'base64'))
  var sigVerficationValid    = signatureUtility.verifySignature(discussionInfoEncoded,potentialSignature,s3VerificationSecret)

  return sigVerficationValid.then(()=>{
    console.log("A")
    return dynamoDBService.simpleObjectSave(discussionInfo,"reply")
  }).then(() => {
    console.log("B")
    return searchService.updateFromComment(discussionInfo.discussionId)
  }).then(() => {
    console.log("C")
    return inboxService.subscribeToDiscussion(discussionInfo.userId,discussionInfo.discussionId)
  }).then(() => {
    console.log("D")
    return inboxService.sendNewCommentNotifications(discussionInfo.userId,discussionInfo.discussionId)
  }).then(() => {
    console.log("E")
    return pushService.subscribeToDiscussion(discussionInfo.userId,discussionInfo.discussionId)
  }).then(() => {
    console.log("F")
    return pushService.sendNewCommentNotifications(discussionInfo.userId,discussionInfo.discussionId)
  })

  /*return sigVerficationValid.then(() => {
    return dynamoDBService.simpleObjectSave(discussionInfo,"reply").then(() => {
        return searchService.updateFromComment(discussionInfo.discussionId).then(() => {
          return inboxService.subscribeToDiscussion(discussionInfo.userId,discussionInfo.discussionId).then(()=> {
            return pushService.subscribeToDiscussion(discussionInfo.userId,discussionInfo.discussionId)
          })
        })
    })
  })*/
}
