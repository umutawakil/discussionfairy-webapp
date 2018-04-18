const container            = require("../../../dependency_injection/container").init()
container.loadFakes()
const app       = require('../../../app').app

const superTest     = require('supertest')
const expect        = require('chai').expect
const assert        = require('chai').assert
/*const sinon         = require("sinon")
const testTools     = require("../../../utilities/test.utilities")

const searchService = require("../../../services/search.services")
const systemService = require("../../../services/system.services")*/

describe("Search Routes: ",function(){
  /*var sandbox     = sinon.createSandbox()
  var searchStub
  var systemStub
  var app

  beforeEach(() => {
    searchStub = sandbox.stub(searchService,"searchDiscussions")
    systemStub = sandbox.stub(systemService,"initSystemConfiguration")
    app        = require('../../../app').app //Due to system service this needs to be loaded late
    testTools.setMockReturnPromise(searchStub,[])
    testTools.setMockReturnEmptyPromise(systemStub)
  })
  afterEach(() => {
    sandbox.restore()
  })*/

  it("Can load search page",function(done){
      superTest(app).get("/d/search")
      .expect(200).then( response =>{
          done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })

  it("Can load discussions browse api page",function(done){
      superTest(app).get("/d/search/discussion/browse/api")
      .then( response =>{
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })
})
