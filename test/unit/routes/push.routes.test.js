const superTest     = require('supertest')
const expect        = require('chai').expect
const assert        = require('chai').assert
const sinon         = require("sinon")
const testTools     = require("../../../utilities/test.utilities")

const pushService   = require("../../../services/push.services")
const systemService = require("../../../services/system.services")

describe("Push(SNS) Routes: ",function(){
  var sandbox     = sinon.createSandbox()
  var pushStub
  var systemStub
  var app

  beforeEach(() => {
    pushStub  =  sandbox.stub(pushService,"apnsRegister")
    systemStub = sandbox.stub(systemService,"initSystemConfiguration")
    app        = require('../../../app').app //Due to system service this needs to be loaded late
    testTools.setMockReturnPromise(pushStub,{})
    testTools.setMockReturnEmptyPromise(systemStub)
  })
  afterEach(() => {
    sandbox.restore()
  })

  it("can handle a request to register user for APNS",function(done){
      superTest(app).post("/d/push/apns/register")
      .set("authentication","Bearer sfsfsfsfsfsfsfsfsfs")
      .set("user-agent","randome-browser")
      .expect(200).then( response =>{
        done()
      })
  })
})

//TODO:: 404 when it exists and others not
