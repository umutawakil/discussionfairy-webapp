const superTest = require('supertest')
const expect    = require('chai').expect
const sinon     = require("sinon")

const systemService        = require("../../../services/system.services")
const testTools            = require("../../../utilities/test.utilities")

//process.env.PublicCDNURL = "XXXXXXX"
//process.env.RecordingSourceURL = "XXXXXXXXXX"

describe("General Routes: ",function(){
  var sandbox = sinon.createSandbox();
  var systemStub
  var app

  beforeEach(() => {
    systemStub                   = sandbox.stub(systemService,"initSystemConfiguration")
    app                          = require('../../../app').app//Due to system service this needs to be loaded late
    testTools.setMockReturnEmptyPromise(systemStub)
  })
  afterEach(() => {
    sandbox.restore()
  })

  it("Recording Page",function(done){
      superTest(app).get("/df/record")
      .expect(200).then( response =>{
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })
  it("How It Works Page",function(done){
      superTest(app).get("/df/how-it-works")
      .expect(200).then( response =>{
        done()
      })
  })
  it("Feedback",function(done){
      superTest(app).get("/df/feedback")
      .expect(200).then( response =>{
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })
  /*it("About",function(done){
      superTest(app).get("/df/about")
      .expect(200).then( response =>{
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })*/
  it("Contact",function(done){
      superTest(app).get("/df/contact")
      .expect(200).then( response =>{
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })
  it("Privacy",function(done){
      superTest(app).get("/df/privacy-terms")
      .expect(200).then( response =>{
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
  })
})
