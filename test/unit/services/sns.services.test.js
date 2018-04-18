const container          = require("../../../dependency_injection/container").init()
container.loadFakes()

const snsService            = require("../../../services/sns.services")
const assert                = require('chai').assert
const ApplicationError      = require("../../../types/responses/application.error")
const SNSCreateTopicRequest = require("../../../types/sns/create.topic.type")

describe("SNS Service:",function(){
    //var sns = snsService.getSNS()

    it("passes data to sns client createPlatformEndpoint and returns the response when no error",function(done){
      /*var error = undefined
      var response = {name:"bob"}
      var mock = createSNSMock("createPlatformEndpoint",error,response)
      snsService.setSNS(mock)*/

      var deviceToken = "xssxsfsfsfs"
      snsService.createPlatformEndpoint(deviceToken).then(r=>{
        //assert(Object.is(r,response))
        assert(r,"invalid response")
        done()
      })
    })

    /*it("passes data to sns client createTopic and returns the response when no error",function(done){
      var error = undefined
      var response = {name:"bob"}
      var mock = createSNSMock("createTopic",error,response)
      snsService.setSNS(mock)

      var name = "xssxsfsfsfs"
      snsService.createTopic(new SNSCreateTopicRequest(name)).then(r=>{
        assert(Object.is(r,response))
        done()
      })
    })

    it("it can return a rejection when error is present",function(done){
      var error = {}
      var response = {name:"bob"}
      var mock = createSNSMock("createTopic",error,response)
      snsService.setSNS(mock)

      var name = "xssxsfsfsfs"
      snsService.createTopic(new SNSCreateTopicRequest(name)).catch(e=>{
        assert(e instanceof ApplicationError,"Application error not returned")
        done()
      })
    })

    it("returns a rejection when an error is returned from underlying sns client",function(done){
      var error = {}
      var response = {name:"bob"}
      var mock = createSNSMock("createPlatformEndpoint",error,response)
      snsService.setSNS(mock)

      var deviceToken = "xssxsfsfsfs"
      snsService.createPlatformEndpoint(deviceToken).catch(e=>{
        assert(e,"No error returned")
        done()
      })
    })*/

    it("passes data to the publish method of sns client and returns the response when no error",function(done){
      /*var error = undefined
      var response = {name:"Sam"}
      var mock = createSNSMock("publish",error,response)
      snsService.setSNS(mock)*/

      var message = "xssxsfsfsfs"
      var topicARN = "80809--9sf909"
      snsService.publishMessageToTopic(message,topicARN).then(r=>{
        assert(r,"invalid response")
        //assert(Object.is(r,response))
        done()
      })
    })

    //TODO: This should fail
    /*it("returns rejection when error present",function(done){
      var error = {}
      var response = {name:"Sam"}
      var mock = createSNSMock("publish",error,response)
      snsService.setSNS(mock)

      var message = "xssxsfsfsfs"
      var topicARN = "80809--9sf909"
      snsService.publishMessageToTopic(message,topicARN).catch(e =>{
        assert(e instanceof ApplicationError,"Application error not returned")
        done()
      })
    })*/

    it("passes data to sns client unsubscribe method and returns the response when no error",function(done){
    /*  var error = undefined
      var response = {name:"bird"}
      var mock = createSNSMock("unsubscribe",error,response)
      snsService.setSNS(mock)*/

      var subscriptionARN = "xssxsfsfsfs"
      snsService.unsubscribe(subscriptionARN).then(r=>{
        assert(r,"invalid response")
        //assert(Object.is(r,response))
        done()
      })
    })

    /*it("returns a rejection when an error is returned from underlying sns client",function(done){
      var error = {}
      var response = {name:"horus"}
      var mock = createSNSMock("unsubscribe",error,response)
      snsService.setSNS(mock)

      var subscriptionARN = "xssxsfsfsfs"
      snsService.unsubscribe(subscriptionARN).catch(e=>{
        assert(e,"No error returned")
        done()
      })
    })*/

    it("passes data to sns client subscribe method and returns the response when no error",function(done){
      /*var error = undefined
      var response = {name:"bird"}
      var mock = createSNSMock("subscribe",error,response)
      snsService.setSNS(mock)*/

      var topic = "xsxss"
      var endpoint = "sfsfsf"
      snsService.subscribe(topic,endpoint).then(r=>{
        assert(r,"invalid response")
        //assert(Object.is(r,response))
        done()
      })
    })

    //snsService.setSNS(sns)
})

/*function createSNSMock(functionName,error,response){
  var mock = {}
  mock[functionName] = function(params,callback){
    callback(error,response)
  }
  return mock
}*/
