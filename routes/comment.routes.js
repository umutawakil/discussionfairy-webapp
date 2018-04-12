
const express           = require('express')
const router            = express.Router()
const commentService    = require('../services/comment.services')
const discussionService = require("../services/discussion.services")
const userService       = require('../services/user.services')
const ResponseData      = require("../shared/response-data")
const commentWebAdapter = require("../adapters/comment.web.adapters.js")
const webWriterService  = require('../services/web.writer.services')
const searchService     = require('../services/search.services')

//TODO:Verify the requestor for these subsequent methods is using the mobile app
//TODO:router.use(securityService.isMobileAppUser)

router.get('/create',function(req,res){
      var discussionInfoEncoded = req.query.info
      var potentialSignature    = req.query.signature
      var result                = commentService.createNewCommentFromS3Response(discussionInfoEncoded,potentialSignature,process.env.S3_VERIFICATION_SECRET)
                                  webWriterService.send(result,res)
})

router.get('/get',function(req,res){
  var discussionId = req.query.discussionId.toLowerCase()
  var result       =
  searchService.getDiscussion(discussionId).then(discussion => {
    return commentService.getComments(discussionId).then(comments => {
       return [discussion].concat(comments)
    })
  })
  webWriterService.json(result,res)
})

//All functions below this line require a user to be authenticated
router.use(userService.isAuthenticatedAppUser)

router.post('/create-new-comment-upload-form-parameters', function (req, res) {
  //console.log("DiscussionId: "+req.body.discussionId)
  //console.log("REQ: "+JSON.stringify(req.body))
  var uploadFormRequest    = commentWebAdapter.parseCommentUploadFormRequest(req)
  var uploadFormParameters = uploadFormRequest.then(request=>{
    var s3Input                   = {}
    s3Input.object                = request
    s3Input.key                   = request.key
    s3Input.type                  = "comment"
    s3Input.accessKey             = process.env.UploaderAccessKey,
    s3Input.secretKey             = process.env.UploaderSecretKey,
    s3Input.recordingSourceBucket = process.env.RecordingSourceBucket,
    s3Input.recordingSourceURL    = process.env.RecordingSourceURL,
    s3Input.recordingUploadURL    = process.env.RecordingUploadURL,
    s3Input.s3VerificationSecret  = process.env.S3_VERIFICATION_SECRET,
    s3Input.domainName            = process.env.DomainName

    return commentService.createUploadFormParameters(s3Input)
  })
  webWriterService.json(uploadFormParameters, res)
})

module.exports = router
