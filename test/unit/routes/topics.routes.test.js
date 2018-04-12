const superTest     = require('supertest')
const expect        = require('chai').expect
const assert        = require('chai').assert
const sinon         = require("sinon")
const testTools     = require("../../../utilities/test.utilities")
const systemService = require("../../../services/system.services")
const searchService = require("../../../services/search.services")

describe("Topics: ",function(){
  var sandbox        = sinon.createSandbox()
  var systemStub
  var topicsStub
  var app

  beforeEach(() => {
    systemStub = sandbox.stub(systemService,"initSystemConfiguration")
    topicsStub     = sandbox.stub(searchService,"searchTopics")
    app            = require('../../../app').app //Due to system service this needs to be loaded late

    testTools.setMockReturnPromise(topicsStub,[])
    testTools.setMockReturnEmptyPromise(systemStub)
  })
  afterEach(() => {
    sandbox.restore()
  })
  it("Can load topics homepage",function(done){
      superTest(app).get("/d/topics")
      .expect(200).then( response =>{
          done()
      })
  })

  it("Can handle api request for topics",function(done){
      superTest(app).get("/d/topics/api")
      .expect(200).then( response =>{
          done()
      })
  })


})
