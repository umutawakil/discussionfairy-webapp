
//const container               = require("../dependency_injection/container").init()
const express                 = require('express')
const router                  = express.Router()
const discussionService       = require('../services/discussion.services.js')
const userService             = require('../services/user.services.js')//container.services.UserService//require('../services/user.services.js')
const ResponseData            = require("../shared/response-data.js")
const discussionWebAdapter    = require("../adapters/discussion.web.adapters.js")
const webWriterService        = require('../services/web.writer.services.js')

//TODO:Verify the requestor for these subsequent methods is using the mobile app
//TODO:router.use(securityService.isMobileAppUser)

router.get('/create',function(req,res){
      var discussionInfoEncoded = req.query.info
      var potentialSignature    = req.query.signature
      var result                = discussionService.createNewDiscussionFromS3Response(discussionInfoEncoded,potentialSignature,process.env.S3_VERIFICATION_SECRET)
                                  webWriterService.send(result,res)
})

//TODO: Needs unit test
router.get('/get',function(req,res){
  var discussionId = req.query.discussionId.toLowerCase()
  var result       = discussionService.searchForDiscussion(discussionId)

  result.then(r=>{
    if(!r || !r.discussionId) {
      res.status(404);
      res.send("404")
    } else {
      webWriterService.json(result,res)
    }
  })

})

//All functions below this line require a user to be authenticated
router.use(userService.isAuthenticatedAppUser)

//TODO:Needs logic to prevent backend cheating
router.post('/upvote',function(req,res){
    var userId            = req.userId
    var discussionId      = req.body.discussionId
    var voteResultPromise = discussionService.upvote(userId,discussionId)
                            webWriterService.send(voteResultPromise,res)

})
router.post('/create-new-discussion-upload-form-parameters', function (req, res) {
  //console.log("DiscussionId: "+req.body.discussionId)
  //console.log("REQ: "+JSON.stringify(req.body))
  var uploadFormRequest    = discussionWebAdapter.parseDiscussionUploadFormRequest(req)
  var uploadFormParameters = uploadFormRequest.then(request=>{
    var s3Input                   = {}
    s3Input.object                = request
    s3Input.key                   = request.key
    s3Input.type                  = "discussion"
    s3Input.accessKey             = process.env.UploaderAccessKey,
    s3Input.secretKey             = process.env.UploaderSecretKey,
    s3Input.recordingSourceBucket = process.env.RecordingSourceBucket,
    s3Input.recordingSourceURL    = process.env.RecordingSourceURL,
    s3Input.recordingUploadURL    = process.env.RecordingUploadURL,
    s3Input.s3VerificationSecret  = process.env.S3_VERIFICATION_SECRET,
    s3Input.domainName            = process.env.DomainName

    return discussionService.createUploadFormParameters(uploadFormRequest, s3Input)
  })
  webWriterService.json(uploadFormParameters, res)
})

router.get('/is-unique',function(req,res) {
  var discussionId = req.query.discussionId
  var result       = discussionService.isDiscussionUnique(discussionId)
                     webWriterService.send(result,res)
})

router.post('/delete',function(req,res){
    var userId            = req.userId
    var discussionId      = req.body.discussionId
    var result            = discussionService.delete(userId,discussionId)
                            webWriterService.send(result,res)
})
router.post('/report',function(req,res){
    var userId            = req.userId
    var discussionId      = req.body.discussionId
    var result            = discussionService.report(userId,discussionId)
                            webWriterService.send(result,res)
})

module.exports = router
