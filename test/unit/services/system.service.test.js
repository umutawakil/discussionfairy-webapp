
const sinon                = require("sinon")
const configurationService = require("../../../services/configuration.services.js")
const rdsService           = require("../../../services/rds.services.js")
const kvService            = require("../../../services/keyvalue.services.js")
const assert               = require('chai').assert
const systemService        = require("../../../services/system.services.js")

describe("System Service:",function(){
    var sandbox
    var configurationServiceStub;
    var rdsServiceStub;
    var kvServiceSaveStub;
    var kvServiceGetStub;
    var kvResponse;

    beforeEach(function(){
      sandbox                  = sinon.createSandbox()
      configurationServiceStub = sandbox.stub(configurationService,"retrieveExternalConfigurations")
      rdsServiceStub           = sandbox.stub(rdsService,"createConnectionPool")
      kvServiceSaveStub        = sandbox.stub(kvService,"saveToKVStore")
      kvServiceGetStub         = sandbox.stub(kvService,"getFromKVStore")
      kvResponse               = "XXXXX"

      configurationServiceStub.callsFake(function(){
        return Promise.resolve({})
      })
      rdsServiceStub.callsFake(function(){
        return Promise.resolve({})
      })
      kvServiceGetStub.callsFake(function(){
        return Promise.resolve(kvResponse)
      })
      kvServiceSaveStub.callsFake(function(){
        return Promise.resolve({})
      })
    })

    afterEach(function(){
      sandbox.restore()
      /*configurationServiceStub.restore()
      rdsServiceStub.restore()
      kvServiceGetStub.restore()
      kvServiceSaveStub.restore()
      systemService.setSchemaInitialized(false)*/
    })

    it("can initialize the system",function(done){
      systemService.initSystemConfiguration().then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("can initialize the system when no secret exists in kv",function(done){
      kvResponse = undefined
      systemService.initSystemConfiguration().then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("can retrieve general info",function(done){
      systemService.generalInfo().then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("does not initialize the schema if it is already initialized",function(done){
      systemService.setSystemInitialized(true)
      /*rdsServiceStub.restore()
      rdsServiceStub = sinon.spy(rdsService,"createConnectionPool")*/

      systemService.initSystemConfiguration().then(r=>{
        assert(rdsServiceStub.called === false,"Attempted to initialize and already initialized schema")
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("will initialize the schema if system is NOT already initialized",function(done){
      systemService.setSystemInitialized(false)
      /*rdsServiceStub.restore()
      rdsServiceStub = sinon.spy(rdsService,"createConnectionPool")*/

      systemService.initSystemConfiguration().then(r=>{
        assert(rdsServiceStub.called ===true,"Failed to initialize schema")
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })
})
