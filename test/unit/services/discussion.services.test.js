const container             = require("../../../dependency_injection/container").init()
container.loadFakes()

const discussionService           = require("../../../services/discussion.services.js")
const assert                      = require('chai').assert
const ExampleDiscussionUploadForm = require("../../../types/discussion/example.upload.form")
const signatureUtility            = require("../../../utilities/signature.utilities.js")

/*function createMock(functionName,promise){
  var mock = {}
  mock[functionName] = function(params){
    return promise
  }
  return mock
}*/

describe("Discussion Service:",function(){

    /*var dynamoDBService = discussionService.getDynamoDBService()
    var inboxService    = discussionService.getInboxService()
    var pushService     = discussionService.getPushService()
    var searchService   = discussionService.getSearchService()
    var rdsService      = discussionService.getRDSService()*/

    it("Returns false when object is returned from underlying service",function(done){
      //var mock = createMock("simpleObjectGet",Promise.resolve({}))
      //discussionService.setDynamoDBService(mock)
      discussionService.isDiscussionUnique("sfsfsfs").then(r=>{
        assert(r===false,"Returned true when object is not unique")
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    /*it("Returns false when object is returned from underlying service",function(done){
      //var mock = createMock("simpleObjectGet",Promise.resolve())
      //discussionService.setDynamoDBService(mock)
      discussionService.isDiscussionUnique("sfsfsfs").then(r=>{
        assert(r===true,"Returned false when object is unique")
        done()
      })
    })*/

    it("should create discussion upload form parameters",function(done){
      //var mock = createMock("simpleObjectGet",Promise.resolve())
      //discussionService.setDynamoDBService(mock)
      var request = new ExampleDiscussionUploadForm()
      var uploadFormRequest = Promise.resolve(request)

      var s3Input                   = {}
      s3Input.object                = request
      s3Input.key                   = request.key
      s3Input.type                  = "discussion"
      s3Input.accessKey             = "XXXXXX"
      s3Input.secretKey             = "XXXXXX"
      s3Input.recordingSourceBucket = "XXXXXX"
      s3Input.recordingSourceURL    = "XXXXXX"
      s3Input.recordingUploadURL    = "XXXXXX"
      s3Input.s3VerificationSecret  = "XXXXXX"
      s3Input.domainName            = "XXXXXX"

      var discussionUploadFormParameters = discussionService.createUploadFormParameters(uploadFormRequest,s3Input)

      discussionUploadFormParameters.then(x=>{
          assert(x,"No discussion upload form parameter created")
          done()

      }).catch(e=>{
        assert(e.code == 400)
        //console.log(e)
        done()
      })
    })

    /*it("should return a rejection if unique check fails",function(done){
      //var mock = createMock("simpleObjectGet",Promise.reject({code:500,message:"a message"}))
      //discussionService.setDynamoDBService(mock)
      var request = new ExampleDiscussionUploadForm()
      var uploadFormRequest = Promise.resolve(request)

      var s3Input                   = {}
      s3Input.object                = request
      s3Input.key                   = request.key
      s3Input.type                  = "discussion"
      s3Input.accessKey             = "XXXXXX"
      s3Input.secretKey             = "XXXXXX"
      s3Input.recordingSourceBucket = "XXXXXX"
      s3Input.recordingSourceURL    = "XXXXXX"
      s3Input.recordingUploadURL    = "XXXXXX"
      s3Input.s3VerificationSecret  = "XXXXXX"
      s3Input.domainName            = "XXXXXX"

      var discussionUploadFormParameters = discussionService.createUploadFormParameters(uploadFormRequest,s3Input)

      discussionUploadFormParameters.catch(r=>{
          assert(r.code===500,"Wrong code returned")
          assert(r.message,"No error message returned")
          done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })*/

    it("retrieves a discussion",function(done){
      //var mock = createMock("simpleObjectGet",Promise.resolve({name:"cat"}))
      //discussionService.setDynamoDBService(mock)

      discussionService.get("sfsfsf").then(x=>{
        //assert(x.name==="cat","No object returned")
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("creates a new discussion from an s3 redirect",function(done){
      /*var dbMock = createMock("simpleObjectSave",Promise.resolve({name:"cat"}))
      discussionService.setDynamoDBService(dbMock)

      var searchMock = createMock("updateWithNewDiscussion",Promise.resolve({}))
      discussionService.setSearchService(searchMock)

      var inboxMock = createMock("subscribeToDiscussion",Promise.resolve({}))
      discussionService.setInboxService(inboxMock)

      var pushMock  = createMock("subscribeToDiscussion",Promise.resolve({}))
      pushMock.createTopic  = x => Promise.resolve({})
      pushMock.sendNewCommentNotifications = x => Promise.resolve({})
      discussionService.setPushService(pushMock)*/

      var s3VerificationSecret = "XXXXXXXXXX"
      var dataObject = {
        userId: "xxxxx",
        discussionId: "xxxxxx",
        discussionId: "ssfsfsf",
        displayDiscussionId: "ssfsfsf",
        discussionTitle: "ssfsfsf",
        //updateTime: d.updateTime,
        referenceLink: "ssfsfsf",
        language:"ssfsfsf",
        location:"ssfsfsf",
        key: "ssfsfsf",
        keywords: ["1","2","3"]
      }
      var encodedInfo = new Buffer(JSON.stringify(dataObject)).toString('base64')
      var signature   = signatureUtility.getSimpleSignature(encodedInfo,s3VerificationSecret)

      discussionService.createNewDiscussionFromS3Response(encodedInfo,signature,s3VerificationSecret).then(x=>{
        assert(x,"No response object returned")
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("returns a rejection when inputs are invalid",function(done){
      /*var dbMock = createMock("simpleObjectSave",Promise.resolve({name:"cat"}))
      discussionService.setDynamoDBService(dbMock)

      var searchMock = createMock("updateWithNewDiscussion",Promise.resolve({}))
      discussionService.setSearchService(searchMock)

      var inboxMock = createMock("subscribeToDiscussion",Promise.resolve({}))
      discussionService.setInboxService(inboxMock)

      var pushMock  = createMock("subscribeToDiscussion",Promise.resolve({}))
      discussionService.setPushService(pushMock)*/

      var s3VerificationSecret = "XXXXXXXXXX"
      var dataObject = {
        name: "cat",
        age: 50,
        height: 20
      }
      var encodedInfo = new Buffer(JSON.stringify(dataObject)).toString('base64')
      var signature   = signatureUtility.getSimpleSignature(encodedInfo,s3VerificationSecret)

      discussionService.createNewDiscussionFromS3Response(encodedInfo+"xxxxx",signature,s3VerificationSecret).catch(e=>{
        assert(e.code===400,"bad input accepted")
        assert(e.message,"No message returned")
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("votes on a discussion",function(done){
      //var mock = createMock("propagateVote",Promise.resolve({name:"cat"}))
      //discussionService.setSearchService(mock)

      var userId       = "sfwfwwfwfwfwf"
      var discussionId = "xsfwfsfwfwfwf"
      discussionService.upvote(userId,discussionId).then(x=>{
        assert(x,"No object returned")
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("deletes a discussion",function(done){
      /*var mock = createMock("preparedStatement",Promise.resolve({name:"cat"}))
      discussionService.setRDSService(mock)

      var mock2 = createMock("simpleObjectDelete",Promise.resolve({name:"cat"}))
      discussionService.setDynamoDBService(mock2)*/

      var userId       = "sfwfwwfwfwfwf"
      var discussionId = "xsfwfsfwfwfwf"
      discussionService.delete(userId,discussionId).then(x=>{
        assert(x,"No object returned")
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })
    it("reports a discussion",function(done){
      //var mock = createMock("preparedStatement",Promise.resolve({name:"cat"}))
      //discussionService.setRDSService(mock)

      var userId       = "sfwfwwfwfwfwf"
      var discussionId = "xsfwfsfwfwfwf"
      discussionService.report(userId,discussionId).then(x=>{
        assert(x,"No object returned")
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    //Undo service mocking
    /*discussionService.setDynamoDBService(dynamoDBService)
    discussionService.setInboxService(inboxService)
    discussionService.setSearchService(searchService)
    discussionService.setPushService(pushService)*/
})
