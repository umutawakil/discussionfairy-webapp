const superTest            = require('supertest')
const expect               = require('chai').expect
const assert               = require('chai').assert
const sinon                = require("sinon")

const discussionService    = require("../../../services/discussion.services")
const discussionWebAdapter = require("../../../adapters/discussion.web.adapters")
const systemService        = require("../../../services/system.services")
const testTools            = require("../../../utilities/test.utilities")

describe("Discusion Routes:",function(){
  var sandbox = sinon.createSandbox();
  var webAdapterStub
  var discussionFormParametersStub
  var discussionCreateStub
  var deleteStub
  var reportStub
  var systemStub
  var app

  beforeEach(() => {
    webAdapterStub               = sandbox.stub(discussionWebAdapter,"parseDiscussionUploadFormRequest")
    discussionFormParametersStub = sandbox.stub(discussionService,"createUploadFormParameters")
    discussionCreateStub         = sandbox.stub(discussionService,"createNewDiscussionFromS3Response")
    discussionUniqueStub         = sandbox.stub(discussionService,"isDiscussionUnique")
    discussionGetStub            = sandbox.stub(discussionService,"get")
    discussionupVoteStub         = sandbox.stub(discussionService,"upvote")
    deleteStub                   = sandbox.stub(discussionService,"delete")
    reportStub                   = sandbox.stub(discussionService,"report")
    systemStub                   = sandbox.stub(systemService,"initSystemConfiguration")
    app                          = require('../../../app').app//Due to system service this needs to be loaded late

    testTools.setMockReturnEmptyPromise(discussionupVoteStub)
    testTools.setMockReturnEmptyPromise(discussionGetStub)
    testTools.setMockReturnEmptyPromise(discussionUniqueStub)
    testTools.setMockReturnEmptyPromise(deleteStub)
    testTools.setMockReturnEmptyPromise(reportStub)
    testTools.setMockReturnEmptyPromise(discussionFormParametersStub)
    testTools.setMockReturnEmptyPromise(webAdapterStub)
    testTools.setMockReturnEmptyPromise(systemStub)
    testTools.setMockReturnEmptyPromise(discussionCreateStub)
  })
  afterEach(() => {
    sandbox.restore()
  })

  it("can handle a request to creates a new discussion", function(done) {
      superTest(app).get("/d/discussion/create?info=xxxxx&signature=xxxxxx")
      .expect(200).then(response => {
        assert(response.text,"Invalid response: "+response.text)
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })
  it("can handle a request for an s3 discussion upload form", function(done) {
      superTest(app).post("/d/discussion/create-new-discussion-upload-form-parameters")
      .set("content-type","application/x-www-form-urlencoded")
      .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
      .expect(200).then(response => {
        assert(response.text,"Invalid response: "+response.text)
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })

  it("can handle a uniquiqeness check request", function(done) {
      superTest(app).get("/d/discussion/is-unique")
      .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
      .query("discussionId="+discussionId)
      .expect(200).then (response=>{
        assert(response.text,"Invalid response: "+response.text)
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })

  /*it("can handle a discussion retrieval request", function(done) {
      superTest(app).get("/d/discussion/get?discussionId=sfsfsfsf")
      .expect(200).then (response=>{
        assert(response.text,"Invalid response: "+response.text)
        done()

      }).catch (e => {
        console.log(e)
        done(e)
      })
  })*/

  it("can handle a sends a vote request", function(done) {
    superTest(app).post("/d/discussion/upvote")
    .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
    .send("discussionId=sfsfsf")
      .expect(200).then(response=>{
        assert(response.text,"Invalid response: "+response.text)
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })

  it("can delete a discussion", function(done) {
    superTest(app).post("/d/discussion/delete")
    .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
    .send("discussionId=sfsfsf")
      .expect(200).then(response=>{
        assert(response.text,"Invalid response: "+response.text)
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })

  it("can report a discussion", function(done) {
    superTest(app).post("/d/discussion/report")
    .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
    .send("discussionId=sfsfsf")
      .expect(200).then(response=>{
        assert(response.text,"Invalid response: "+response.text)
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })



})
