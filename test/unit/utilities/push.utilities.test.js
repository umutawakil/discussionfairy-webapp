const assert          = require('chai').assert
const pushUtility     = require("../../../utilities/push.utilities")
const sinon           = require("sinon")
const snsService      = require("../../../services/sns.services")
const dynamoDBService = require("../../../services/dynamodb.services")

describe("Push Utility",function(){

  it("gets a push registration",function(done){
    var dynamoStub = sinon.stub(dynamoDBService,"simpleObjectGet")
    dynamoStub.callsFake(function(){
      return Promise.resolve({})
    })
    pushUtility.getPushRegistration("testUserId").then(r=>{
      done()
      dynamoStub.restore()

    }).catch(e=>{
      console.log(e)
      done(e)
    })
  })

  it("calls publishMessageToTopic on underlying sns service",function(done){
    var snsStub = sinon.stub(snsService,"publishMessageToTopic")
    snsStub.callsFake(function(){
      return Promise.resolve({})
    })

    //functionName,msg,topic
    var functioName = "publishMessageToTopic"
    var message = "a message"
    var topic = Promise.resolve({topicARN:"XXXXXX"})

    pushUtility.publish(functioName,message,topic).then(r=>{
      done()
      snsStub.restore()
    }).catch(e=>{
      console.log(e)
      done(e)
    })
  })

  it("gets a topic",function(done){
    var dynamoStub = sinon.stub(dynamoDBService,"simpleObjectGet")
    dynamoStub.callsFake(function(){
      return Promise.resolve({})
    })
    pushUtility.getTopic("testUserId","apns").then(r=>{
      done()
      dynamoStub.restore()
    }).catch(e=>{
      console.log(e)
      done(e)
    })
  })

  it("gets a subscription",function(done){
    var dynamoStub = sinon.stub(dynamoDBService,"simpleObjectGet")
    dynamoStub.callsFake(function(){
      return Promise.resolve({})
    })
    pushUtility.getSubscription("testUserId",Promise.resolve({})).then(r=>{
      done()
      dynamoStub.restore()
    }).catch(e=>{
      console.log(e)
      done(e)
    })
  })

  it("unsubscribes a user from a topic",function(done){
    var dynamoStub = sinon.stub(dynamoDBService,"simpleObjectGet")
    dynamoStub.callsFake(function(){
      return Promise.resolve({})
    })
    var snsStub = sinon.stub(snsService,"unsubscribe")
    snsStub.callsFake(function(){
      return Promise.resolve({})
    })

    var topic = Promise.resolve({topicARN:"xxxxx"})
    pushUtility.unsubscribe("testUserId",topic).then(r=>{
      done()
      dynamoStub.restore()
      snsStub.restore()
    }).catch(e=>{
      console.log(e)
      done(e)
    })

  })

  it("subscribes a user to a topic",function(done){
    var snsStub = sinon.stub(snsService,"subscribe")
    snsStub.callsFake(function(){
      return Promise.resolve({})
    })

    var topic        = Promise.resolve({topicARN:"xxxxx"})
    var registration = Promise.resolve({endpointARN:"xxxxx"})
    pushUtility.subscribe(topic,registration).then(r=>{
      done()
      snsStub.restore()
    }).catch(e=>{
      console.log(e)
      done(e)
    })

  })

})
