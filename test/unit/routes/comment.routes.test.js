const superTest            = require('supertest')
const expect               = require('chai').expect
const assert               = require("chai").assert
const sinon                = require("sinon")
const testTools            = require("../../../utilities/test.utilities")

const commentService       = require("../../../services/comment.services")
const searchService        = require("../../../services/search.services")
const systemService        = require("../../../services/system.services")
const discussionWebAdapter = require("../../../adapters/discussion.web.adapters")

describe("Comment Routes: ",function() {
  var sandbox     = sinon.createSandbox()
  var commentFormParametersStub
  var commentCreateStub
  var webAdapterStub
  var systemStub
  var app

  var userResponse = { val: "test"}
  beforeEach(() => {
    commentFormParametersStub  = sandbox.stub(commentService,"createUploadFormParameters")
    discussionGetStub          = sandbox.stub(searchService,"getDiscussion")
    commentsGetStub            = sandbox.stub(commentService,"getComments")
    commentCreateStub          = sandbox.stub(commentService,"createNewCommentFromS3Response")
    webAdapterStub             = sandbox.stub(discussionWebAdapter,"parseDiscussionUploadFormRequest")
    systemStub                 = sandbox.stub(systemService,"initSystemConfiguration")
    app                        = require('../../../app').app //Due to system service this needs to be loaded late

    commentFormParametersStub.callsFake(() => {
      return Promise.resolve(userResponse)
    })
    webAdapterStub.callsFake(() => {
      return Promise.resolve({})
    })
    systemStub.callsFake(() => {
      return Promise.resolve({})
    })
    commentCreateStub.callsFake(() => {
      return Promise.resolve(userResponse)
    })
    testTools.setMockReturnPromise(commentsGetStub,{name:"bob"})
    testTools.setMockReturnPromise(discussionGetStub,{name:"john"})
  })
  afterEach(() => {
    sandbox.restore()
  })

  it("can get comment upload form parameters",function(done) {
      superTest(app).post("/d/comment/create-new-comment-upload-form-parameters")
      .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
      .send("discussionId=sfsfsf&extension=m4a")
      .expect(200).then( response => {
        assert(response.text === JSON.stringify(userResponse))
        done()
      }).catch(e => {
        console.log("TEST FAILED")
        console.log(e)
        done(e)
      })
  })

  it("can create a new comment", function(done) {
      var discussion = {
        discussionId: "XXXXX",
        keywords: ["a","b","c"]
      }
      var info = new Buffer(JSON.stringify(discussion)).toString('base64')
      var signature = "xxxxxxxx"
      superTest(app).get("/d/comment/create")
      .query("info="+info+"&signature="+signature)
      .expect(200).then( response => {
        assert(response.text === JSON.stringify(userResponse), "invalid response: "+response.text)
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })

  it("can handle a comments retrieval request", function(done) {
      superTest(app).get("/d/comment/get")
      .query("discussionId=ss44f4rr4")
      .expect(200).then (response => {
        //console.log(JSON.stringify(response))
        assert(response.text,"Invalid response: "+response.text)
        done()

      }).catch (e => {
        console.log(e)
        done(e)
      })
  })
})
