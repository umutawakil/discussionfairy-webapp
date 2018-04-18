const container            = require("../../../dependency_injection/container").init()
container.loadFakes()
const app       = require('../../../app').app

const superTest     = require('supertest')
const expect        = require('chai').expect
const assert        = require('chai').assert
/*const sinon         = require("sinon")
const testTools     = require("../../../utilities/test.utilities")
const systemService = require("../../../services/system.services")
const userService   = require("../../../services/user.services")*/

describe("Mobile Passive User Creation",function(){
  /*var sandbox        = sinon.createSandbox()
  var systemStub
  var userStub
  var app

  beforeEach(() => {
    systemStub = sandbox.stub(systemService,"initSystemConfiguration")
    userStub   = sandbox.stub(userService,"createMobilePassiveUser")
    app        = require('../../../app').app //Due to system service this needs to be loaded late

    testTools.setMockReturnPromise(userStub,{})
    testTools.setMockReturnEmptyPromise(systemStub)
  })
  afterEach(() => {
    sandbox.restore()
  })*/
  it("Generates a new user and returns a token.",function(done){
      superTest(app).post("/d/user/mobile-passive-create")
      .set("content-type","application/x-www-form-urlencoded")
      //.set("authentication","Bearer "+"xsfsfsfsfsfsfsffssf")
      //.send(objectToQueryString(info))
      .expect(200)
      .end(function(err,res){

        if (err){
          return done(err)

        } else {
          done()
        }
      })
  })

})
