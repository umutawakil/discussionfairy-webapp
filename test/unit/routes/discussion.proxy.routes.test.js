const container          = require("../../../dependency_injection/container").init()
container.loadFakes()

const superTest     = require('supertest')
const expect        = require('chai').expect
const assert        = require("chai").assert
const app           = require('../../../app').app

/*const testTools         = require("../../../utilities/test.utilities")

const discussionService = require("../../../services/discussion.services")
const commentService    = require("../../../services/comment.services")
const systemService     = require("../../../services/system.services")*/

var info = {
  discussionId: "sfsfsfsfsf",
  keywords:["a","b","c"],
  discussionTitle: "a valid title",
  location: "France",
  language: "French",
  extension: "mp3"
}

describe("Discussion Proxy Routes: ",function(){
  /*var sandbox     = sinon.createSandbox()
  var commentsStub
  var discussionStub
  var systemStub
  var app

  beforeEach(() => {
    commentsStub   = sandbox.stub(commentService,"getComments")
    discussionStub = sandbox.stub(discussionService,"get")
    systemStub     = sandbox.stub(systemService,"initSystemConfiguration")
    //coldStartStub  = sandbox.stub(systemService,"coldStartCheck")
    testTools.setMockReturnEmptyPromise(systemStub)
    app            = require('../../../app').app //Due to system service this needs to be loaded late
  })
  afterEach(() => {
    sandbox.restore()
  })*/

  //Setting error codes for various conditions is handled by an isolated component

  it("can load a discussion page",function(done){
      //testTools.setMockReturnPromise(discussionStub,info)
      //testTools.setMockReturnEmptyPromise(commentsStub)

      superTest(app).get("/WorldPeace2017")
      .expect(200).then( response =>{
        //console.log(response.text)
        assert(response.text,"NO response data")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })

  /*it("can return 404 when a discussion does not exist",function(done){
      //testTools.setMockReturnPromise(discussionStub,undefined)
      //testTools.setMockReturnPromise(commentsStub,undefined)

      superTest(app).get("/WorldPeace2017")
      .expect(404).then( response =>{
        //console.log(response.text)
        assert(response.text,"NO response data")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })*/
})
