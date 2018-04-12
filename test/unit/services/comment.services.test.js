const commentService              = require("../../../services/comment.services.js")
const DiscussionUploadRequestForm = require("../../../types/discussion/upload.form.request.js")
const assert                      = require('chai').assert
const signatureUtility            = require("../../../utilities/signature.utilities.js")
//const sinon          = require("sinon")

function createMock(functionName,promise){
  var mock = {}
  mock[functionName] = function(params){
    return promise
  }
  return mock
}

describe("Comment Service:",function(){
  var dynamoDBService = commentService.getDynamoDBService()
  var inboxService    = commentService.getInboxService()
  var pushService     = commentService.getPushService()
  var searchService   = commentService.getSearchService()

  it("should create discussion upload form parameters when input is valid",function(done){
    var mock = createMock("simpleObjectGet",Promise.resolve())
    commentService.setDynamoDBService(mock)
    var request = new DiscussionUploadRequestForm()
    var uploadFormRequest = Promise.resolve(request)

    var s3Input                   = {}
    s3Input.object                = request
    s3Input.key                   = request.key
    s3Input.type                  = "comment"
    s3Input.accessKey             = "XXXXXX"
    s3Input.secretKey             = "XXXXXX"
    s3Input.recordingSourceBucket = "XXXXXX"
    s3Input.recordingSourceURL    = "XXXXXX"
    s3Input.recordingUploadURL    = "XXXXXX"
    s3Input.s3VerificationSecret  = "XXXXXX"
    s3Input.domainName            = "XXXXXX"

    var discussionUploadFormParameters = commentService.createUploadFormParameters(s3Input)

    discussionUploadFormParameters.then(x=>{
        assert(x,"No discussion upload form parameter created")
        done()
    }).catch(e=>{
      console.log(e)
      done(e)
    })
  })

  //TODO: Need to limit the number of posts a user makes

  it("retrieves comments for a given discussion",function(done){
    var results = [
      {name: "cat"}
    ]
    var mock = createMock("getComments",Promise.resolve(results))
    commentService.setDynamoDBService(mock)

    var key = {discussionId:"sfsfs"}
    commentService.getComments(key).then(x=>{
      assert(x[0].name==="cat","No object returned")
      done()
    })
  })

  it("creates a new discussion from an s3 redirect",function(done){
    var dbMock = createMock("simpleObjectSave",Promise.resolve({name:"cat"}))
    commentService.setDynamoDBService(dbMock)

    var searchMock = createMock("updateFromComment",Promise.resolve({}))
    commentService.setSearchService(searchMock)

    var inboxMock = createMock("subscribeToDiscussion",Promise.resolve({}))
    inboxMock.sendNewCommentNotifications = () => { return Promise.resolve({})}
    commentService.setInboxService(inboxMock)

    var pushMock  = createMock("subscribeToDiscussion",Promise.resolve({}))
    pushMock.sendNewCommentNotifications = () => { return Promise.resolve({})}
    commentService.setPushService(pushMock)

    var s3VerificationSecret = "XXXXXXXXXX"
    var dataObject = {
      name: "cat",
      age: 50,
      height: 20
    }
    var encodedInfo = new Buffer(JSON.stringify(dataObject)).toString('base64')
    var signature   = signatureUtility.getSimpleSignature(encodedInfo,s3VerificationSecret)

    commentService.createNewCommentFromS3Response(encodedInfo,signature,s3VerificationSecret).then(x=>{
      assert(x,"incorrect response object returned")
      done()
    }).catch(e=>{
      console.log(e)
      done(e)
    })
  })

  it("returns a rejection when inputs are invalid",function(done){
    var dbMock = createMock("simpleObjectSave",Promise.resolve({name:"cat"}))
    commentService.setDynamoDBService(dbMock)

    var searchMock = createMock("updateFromDiscussion",Promise.resolve({}))
    commentService.setSearchService(searchMock)

    var inboxMock = createMock("subscribeToDiscussion",Promise.resolve({}))
    commentService.setInboxService(inboxMock)

    var pushMock  = createMock("subscribeToDiscussion",Promise.resolve({}))
    commentService.setPushService(pushMock)

    var s3VerificationSecret = "XXXXXXXXXX"
    var dataObject = {
      name: "cat",
      age: 50,
      height: 20
    }
    var encodedInfo = new Buffer(JSON.stringify(dataObject)).toString('base64')
    var signature   = signatureUtility.getSimpleSignature(encodedInfo,s3VerificationSecret)

    commentService.createNewCommentFromS3Response(encodedInfo+"xxxxx",signature,s3VerificationSecret).catch(e=>{
      assert(e.code===400,"bad input accepted")
      assert(e.message,"No message returned")
      done()
    })
  })

  //Undo service mocking
  commentService.setDynamoDBService(dynamoDBService)
  commentService.setInboxService(inboxService)
  commentService.setSearchService(searchService)
  commentService.setPushService(pushService)
})
