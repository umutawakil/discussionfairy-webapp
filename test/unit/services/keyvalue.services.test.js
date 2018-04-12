const kvService       = require("../../../services/keyvalue.services")
const dynamoDBServce  = require("../../../services/dynamodb.services")
const sinon           = require("sinon")
const assert          = require("chai").assert

describe("KV Service:",function(){
    var getStub
    var saveStub

    beforeEach(()=>{
      getStub  = sinon.stub(dynamoDBServce,"simpleObjectGet")
      getStub.callsFake(()=>{
        return Promise.resolve({})
      })
      saveStub = sinon.stub(dynamoDBServce,"simpleObjectSave")
      saveStub.callsFake(()=>{
        return Promise.resolve({})
      })
    })

    afterEach(()=>{
      getStub.restore()
      saveStub.restore()
    })

    it("retrieves a key value",function(done){
      kvService.getFromKVStore("something").then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })
    it("saves a key value",function(done){
      kvService.saveToKVStore("objectName",{}).then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })
})
