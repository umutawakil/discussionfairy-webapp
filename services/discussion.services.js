const utilities          = require('../shared/utilities')
const settings           = require("../settings.json")
const signatureUtility   = require("../utilities/signature.utilities")
const discussionDecision = require("../decisions/discussion.decisions")
const s3Decision         = require('../decisions/s3.decisions')
const BadUserInput       = require("../types/responses/bad.user.input")
const dynamoDBService    = require('../services/dynamodb.services')
const searchService      = require("../services/search.services")
const pushService        = require('../services/push.services')
const inboxService       = require('../services/inbox.services')
const rdsService           = require("../services/rds.services")

/*module.exports.setRDSService = function(x) {
  rdsService = x
}
module.exports.getRDSService = function() {
  return rdsService
}

module.exports.setDynamoDBService = function(x){
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

module.exports.createUploadFormParameters = function(uploadFormRequest,s3Input) {
  var verifyIsUnique = function(input){
      var uniqueRequest = input.then(request=>{
        return module.exports.isDiscussionUnique(request.discussionId)
      })
      return discussionDecision.returnObectIfTrue(uniqueRequest,new BadUserInput("DiscussionId Already Taken"))
  }

  var verifiedUniqueRequest = verifyIsUnique(uploadFormRequest)
  var uploadFormParameters  = verifiedUniqueRequest.then(request=>{
      return s3Decision.createUploadFormParameters(s3Input)
  })
  return uploadFormParameters
}

/*module.exports.generateReplyUploadFormParameters = function(req,res,input) {
  var promise = new Promise((resolve,reject) => {
        var result = discussionUtility.isNewReplyFormatValid(input)
        if(result.invalid){
            securityLogAndRespond(req,res,"Invalid Reply form: "+result.message)
            return
        }

        var key          = discussionUtility.createReplyKey(input)
        input.key        = key
        input.timestamp  = new Date().getTime()
        //var redirectURL  = discussionUtility.createReplyRedirectURL(input)
        discussionUtility.createReplyRedirectURL(input).then(redirectURL =>{
          return resolve(s3UploadService.createUploadFormParameters(key,redirectURL))
        })
    })
  return promise
}*/

module.exports.isDiscussionUnique = function(discussionId) {
  var discussionPromise = dynamoDBService.simpleObjectGet({discussionId:discussionId.toLowerCase()},"discussion")
  return discussionDecision.promiseResultDoesNotExist(discussionPromise)
}

module.exports.createNewDiscussionFromS3Response = function(discussionInfoEncoded,potentialSignature,s3VerificationSecret) {
  var discussionInfo         = JSON.parse(Buffer.from(discussionInfoEncoded, 'base64'))
  var sigVerficationValid    = signatureUtility.verifySignature(discussionInfoEncoded,potentialSignature,s3VerificationSecret)

  return sigVerficationValid.then(()=>{
    return dynamoDBService.simpleObjectSave(discussionInfo,"discussion")
  }).then(() => {
    return searchService.updateWithNewDiscussion(discussionInfo)
  }).then(() => {
    return inboxService.subscribeToDiscussion(discussionInfo.userId,discussionInfo.discussionId)
  }).then(() => {
    return pushService.createTopic(discussionInfo.discussionId)
  }).then(() => {
    return pushService.subscribeToDiscussion(discussionInfo.userId,discussionInfo.discussionId)
  })
}

/*module.exports.createNewReplyFromS3Response = function(req,res) {
  var infoEncoded        = req.query.info
  var info               =  JSON.parse(Buffer.from(infoEncoded, 'base64'))
  var potentialSignature = req.query.signature

  return
          verifySignature(req,res,infoEncoded,potentialSignature)
              .then(()=>{
                info.discussionId = info.discussionId.toLowerCase()
                return storageUtility.simpleObjectSave(info,"reply")
              })
              .then(()=>{
                var promises = [
                  inboxService.sendNewCommentNotifications(info.userId,info.discussionId),
                  pushService.sendNewCommentNotifications(info.userId,info.discussionId)
                ]
                return Promise.All(promises)
              })
}*/

//TODO: Needs unit test
module.exports.get = function(discussionId) {
  var key = {discussionId: discussionId.toLowerCase()}
  return dynamoDBService.simpleObjectGet(key,"discussion")
}

//TODO: Needs unit test. Used when an object retrieveal can fail and is acceptable.
module.exports.searchForDiscussion = function(discussionId) {
  var key = {discussionId: discussionId.toLowerCase()}
  return dynamoDBService.simpleObjectGet(key,"discussion").then(r=>{
    if(!r) {
      return {}
    } else {
      return r;
    }
  })
}

module.exports.upvote = function(userId,discussionId) {
  //Check if the user already voted? //TODO:
  return searchService.propagateVote(userId,discussionId)
}

//TODO: Needs unit tests
module.exports.delete = function(userId,inputId) {
  var query = "DELETE FROM discussion WHERE discussionId = ? AND userId = ?"
  var discussionId = inputId.toLowerCase()
  var parameters = [discussionId,userId]
  return rdsService.preparedStatement(query,parameters).then(() => {
    var params = {
      discussionId: discussionId
    }
    return dynamoDBService.simpleObjectDelete(params,"discussion")
  })
}

//TODO: Needs more info and a way to notify me.
module.exports.report = function(userId,discussionId) {
  var query = "REPLACE INTO report SET userId = ?, discussionId = ?, reportTime = UNIX_TIMESTAMP()"
  var parameters = [userId,discussionId]
  return rdsService.preparedStatement(query,parameters)
}
