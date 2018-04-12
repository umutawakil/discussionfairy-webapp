const superTest = require('supertest')
const expect    = require('chai').expect
const assert    = require('chai').assert
const sinon     = require("sinon")
const testTools = require("../../../utilities/test.utilities")

const searchService = require("../../../services/search.services")
const systemService = require("../../../services/system.services")

describe("Homepage: ",function(){
  var sandbox     = sinon.createSandbox()
  var searchStub
  var systemStub
  var coldStub
  var app

  beforeEach(() => {
    searchStub     =  sandbox.stub(searchService,"searchDiscussions")
    testTools.setMockReturnPromise(searchStub,[])
    systemStub     = sandbox.stub(systemService,"initSystemConfiguration")
    testTools.setMockReturnEmptyPromise(systemStub)
    //coldStub       = sandbox.stub(systemService,"coldStartCheck")
    //testTools.setMockReturnPromise(coldStub,{})
    app            = require('../../../app').app //Due to system service this needs to be loaded late
  })
  afterEach(() => {
    sandbox.restore()
  })
  it("Can load homepage",function(done){
      superTest(app).get("/")
      .expect(200).then( r => {
        assert(r.text,"No response returned")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })

  it("Can load home URL",function(done){
      superTest(app).get("/home")
      .expect(200).then( r => {
        assert(r.text,"No response returned")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })

})
