const container          = require("../../../dependency_injection/container").init()
container.loadFakes()

//const sinon           = require("sinon")
const pushService     = require("../../../services/push.services")
//const dynamoDBService = require("../../../services/dynamodb.services")
//const snsService      = require("../../../services/sns.services")
const assert          = require('chai').assert
//const pushUtility     = require("../../../utilities/push.utilities")
//const testTools       = require("../../../utilities/test.utilities")

describe("Push Service:",function(){
    /*var sandbox = sinon.createSandbox()

    beforeEach(function(){

    })
    afterEach(function(){
      sandbox.restore()
    })*/

    it("registers apns device",function(done){
      /*var dynamoStub = sandbox.stub(dynamoDBService,"simpleObjectSave")
      dynamoStub.callsFake(function(){
        return Promise.resolve({})
      })
      var snsStub = sandbox.stub(snsService,"createPlatformEndpoint")
      snsStub.callsFake(function(){
        return Promise.resolve({})
      })*/
      pushService.apnsRegister("testUserId","testDeviceToken").then(r=>{
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("creates a new push notification topic",function(done){
      /*var dynamoStub = sandbox.stub(dynamoDBService,"simpleObjectSave")
      dynamoStub.callsFake(function(){
        return Promise.resolve({})
      })
      var snsStub = sandbox.stub(snsService,"createTopic")
      snsStub.callsFake(function(){
        return Promise.resolve({})
      })*/

      var discussionId = "testDiscussionId"
      pushService.createTopic(discussionId).then(r=>{
        /*var configs = [{
          type:"apns",
          name:discussionId+"_apns"
        },{
          type:"gcm",
          name:discussionId+"_gcm"
        }]
        for(var i=0; i < r.length; i++){
          assert(JSON.stringify(configs[i])===JSON.stringify(r[i]),"Objects don't match")
        }*/
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("subscribes to a discussion",function(done){
      /*var dynamoStub1 = sandbox.stub(dynamoDBService,"simpleObjectSave")
      dynamoStub1.callsFake(function(){
        return Promise.resolve({})
      })
      var dynamoStub2 = sandbox.stub(dynamoDBService,"simpleObjectGet")
      dynamoStub2.callsFake(function(){
        return Promise.resolve({})
      })
      var snsStub = sandbox.stub(snsService,"subscribe")
      snsStub.callsFake(function(){
        return Promise.resolve({})
      })*/
      pushService.subscribeToDiscussion("testUserId","testDiscussionId").then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("unsubscribes from a discussion",function(done){
      /*var dynamoStub2 = sandbox.stub(dynamoDBService,"simpleObjectGet")
      dynamoStub2.callsFake(function(){
        return Promise.resolve({})
      })
      var snsStub = sandbox.stub(snsService,"unsubscribe")
      snsStub.callsFake(function(){
        return Promise.resolve({})
      })*/
      pushService.unsubscribe("testUserId","testDiscussionId").then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("Can send APNS notification from unsubscribed but registered user",function(done){
      /*var registrationData = {
        userId: "userId1",
        deviceToken: "deviceToken1",
        endpointARN: "endpointARN1",
        type: "apns"
      }
      var getRegistrationStub = sandbox.stub(pushUtility,"getPushRegistration")
      getRegistrationStub.callsFake(function(){
        return Promise.resolve(registrationData)
      })

      var topicData = {
        type: "apns",
        discussionId: "discussionId1",
        topicARN: "topicARN1"
      }
      var getTopicStub = sandbox.stub(pushUtility,"getTopic")
      getTopicStub.callsFake(function(){
        return Promise.resolve(topicData)
      })

      var subscribeStub = sandbox.stub(pushUtility,"subscribe")
      subscribeStub.callsFake(function(){
        return Promise.resolve({})
      })
      var unsubscribeStub = sandbox.stub(pushUtility,"unsubscribe")
      unsubscribeStub.callsFake(function(){
        return Promise.resolve({})
      })
      var publishStub = sandbox.stub(pushUtility,"publish")
      publishStub.callsFake(function(){
        return Promise.resolve({})
      })*/

      pushService.sendNewCommentNotifications("userId","discussionId").then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("Can send APNS notification",function(done){

      pushService.sendNewCommentNotifications("userId","discussionId").then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    /*it("Can send APNS notification from unregistered user",function(done){
      var getRegistrationStub = sandbox.stub(pushUtility,"getPushRegistration")
      getRegistrationStub.callsFake(function(){
        return Promise.resolve()
      })
      var topicData = {
        type: "apns",
        discussionId: "discussionId1",
        topicARN: "topicARN1"
      }
      var getTopicStub = sandbox.stub(pushUtility,"getTopic")
      getTopicStub.callsFake(function(){
        return Promise.resolve(topicData)
      })

      var publishStub = sandbox.stub(pushUtility,"publish")
      publishStub.callsFake(function(){
        return Promise.resolve({})
      })

      var mock = sandbox.mock(pushUtility)
      mock.expects("subscribe").never()
      mock.expects("unsubscribe").never()

      pushService.sendNewCommentNotifications("userId","discussionId").then(r=>{
        //mock.verify()
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })*/

    /*it("Can send notification APNS from subscribed and registered user",function(done){
      var registrationData = {
        userId: "userId1",
        deviceToken: "deviceToken1",
        endpointARN: "endpointARN1",
        type: "apns"
      }
      var getRegistrationStub = sandbox.stub(pushUtility,"getPushRegistration")
      getRegistrationStub.callsFake(function(){
        return Promise.resolve(registrationData)
      })
      var getSubscriptionStub = sandbox.stub(pushUtility,"getSubscription")
      getSubscriptionStub.callsFake(function(){
        return Promise.resolve({subscriptionARN:"XXXXXXX"})
      })
      var topicData = {
        type: "apns",
        discussionId: "discussionId1",
        topicARN: "topicARN1"
      }
      var getTopicStub = sandbox.stub(pushUtility,"getTopic")
      getTopicStub.callsFake(function(){
        return Promise.resolve(topicData)
      })

      var subscribeStub = sandbox.stub(pushUtility,"subscribe")
      subscribeStub.callsFake(function(){
        return Promise.resolve({})
      })
      var unsubscribeStub = sandbox.stub(pushUtility,"unsubscribe")
      unsubscribeStub.callsFake(function(){
        return Promise.resolve({})
      })
      var publishStub = sandbox.stub(pushUtility,"publish")
      publishStub.callsFake(function(){
        return Promise.resolve({})
      })

      pushService.sendNewCommentNotifications("userId","discussionId").then(r=>{
        assert(subscribeStub.called,"subscribe not called")
        assert(unsubscribeStub.called,"unsubscribe not called")
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })*/

    /*it("Can send notification APNS from unsubscribed but registered user",function(done){
      var registrationData = {
        userId: "userId1",
        deviceToken: "deviceToken1",
        endpointARN: "endpointARN1",
        type: "apns"
      }
      var getRegistrationStub = sandbox.stub(pushUtility,"getPushRegistration")
      getRegistrationStub.callsFake(function(){
        return Promise.resolve(registrationData)
      })
      var getSubscriptionStub = sandbox.stub(pushUtility,"getSubscription")
      getSubscriptionStub.callsFake(function(){
        return Promise.resolve()
      })
      var topicData = {
        type: "apns",
        discussionId: "discussionId1",
        topicARN: "topicARN1"
      }
      var getTopicStub = sandbox.stub(pushUtility,"getTopic")
      getTopicStub.callsFake(function(){
        return Promise.resolve(topicData)
      })

      var subscribeStub = sandbox.stub(pushUtility,"subscribe")
      subscribeStub.callsFake(function(){
        return Promise.resolve({})
      })
      var unsubscribeStub = sandbox.stub(pushUtility,"unsubscribe")
      unsubscribeStub.callsFake(function(){
        return Promise.resolve({})
      })
      var publishStub = sandbox.stub(pushUtility,"publish")
      publishStub.callsFake(function(){
        return Promise.resolve({})
      })

      pushService.sendNewCommentNotifications("userId","discussionId").then(r=>{
        assert(subscribeStub.called,"subscribe not called")
        assert(unsubscribeStub.called,"unsubscribe not called")
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })*/

})
