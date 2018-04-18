const container            = require("../../../dependency_injection/container").init()
container.loadFakes()
const app       = require('../../../app').app

const superTest     = require('supertest')
const expect        = require('chai').expect
const assert        = require('chai').assert
/*const sinon         = require("sinon")
const testTools     = require("../../../utilities/test.utilities")
const systemService = require("../../../services/system.services")*/

describe("System Routes: ",function(){
  /*var sandbox        = sinon.createSandbox()
  var systemInitStub
  var infoStub
  //var coldStub
  var app

  beforeEach(() => {
    systemStub = sandbox.stub(systemService,"initSystemConfiguration")
    infoStub   = sandbox.stub(systemService,"generalInfo")
    //coldStub   = sandbox.stub(systemService,"coldStartCheck")
    testTools.setMockReturnPromise(infoStub,{})
    testTools.setMockReturnEmptyPromise(systemStub)
    //testTools.setMockReturnPromise(coldStub,{})
    app        = require('../../../app').app //Due to system service this needs to be loaded late
  })
  afterEach(() => {
    sandbox.restore()
  })*/
  it("retrieves general info",function(done){
      superTest(app).get("/d/system/general-info")
      .expect(200).then( response =>{
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })
})
