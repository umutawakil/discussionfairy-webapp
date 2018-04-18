const container            = require("../../../dependency_injection/container").init()
container.loadFakes()
const app       = require('../../../app').app

const superTest     = require('supertest')
const expect        = require('chai').expect
const assert        = require('chai').assert
/*const sinon         = require("sinon")
const testTools     = require("../../../utilities/test.utilities")

const inboxService  = require("../../../services/inbox.services")
const systemService = require("../../../services/system.services")
const pushService   = require('../../../services/push.services')*/

describe("Inbox Routes: ",function(){
  /*var sandbox     //= sinon.createSandbox()
  var inboxStub
  var countStub
  var deleteStub
  var subStub
  var pushSubStub
  var unsubStub
  var pushUnsubStub
  var systemStub
  var app

  beforeEach(() => {
    sandbox       = sinon.createSandbox()
    inboxStub     = sandbox.stub(inboxService,"get")
    countStub     = sandbox.stub(inboxService,"count")
    deleteStub    = sandbox.stub(inboxService,"delete")
    subStub       = sandbox.stub(inboxService,"subscribeToDiscussion")
    unsubStub     = sandbox.stub(inboxService,"unsubscribe")
    pushUnsubStub = sandbox.stub(pushService,"unsubscribe")
    pushSubStub   = sandbox.stub(pushService,"subscribeToDiscussion")
    systemStub    = sandbox.stub(systemService,"initSystemConfiguration")
    app           = require('../../../app').app //Due to system service this needs to be loaded late

    testTools.setMockReturnPromise(inboxStub,[])
    testTools.setMockReturnPromise(unsubStub,{})
    testTools.setMockReturnPromise(subStub,{})
    testTools.setMockReturnPromise(pushUnsubStub,{})
    testTools.setMockReturnPromise(pushSubStub,{})
    testTools.setMockReturnPromise(countStub,{count: 5})
    testTools.setMockReturnPromise(deleteStub,{})
    testTools.setMockReturnPromise(systemStub,{})
  })
  afterEach(() => {
    sandbox.restore()
  })*/
  it("gets the inbox count",function(done){
      superTest(app).get("/d/inbox/count")
      .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
      .expect(200).then( response =>{
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })

  it("gets the inbox",function(done){
      superTest(app).get("/d/inbox")
      .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
      .expect(200).then( response =>{
        done()
      })
  })
  it("deletes an inbox item",function(done){
      superTest(app).post("/d/inbox/delete")
      .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
      .expect(200).then( response =>{
        done()
      })
  })
  it("subscribes to a discussion",function(done){
      superTest(app).post("/d/inbox/subscribe")
      .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
      .expect(200).then( response =>{
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })
  it("unsubscribes from a discussion",function(done){
      superTest(app).post("/d/inbox/unsubscribe")
      .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
      .expect(200).then( response =>{
        done()
      })
  })
})

//TODO:: 404 when it exists and others not
