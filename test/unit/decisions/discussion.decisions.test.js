const discussionDecision = require("../../../decisions/discussion.decisions.js")
const assert             = require('chai').assert
const BadUserInput       = require("../../../types/responses/bad.user.input.js")
const sharedUtility      = require("../../../shared/utilities.js")

describe("Discussion Decisions:",function(){

    it("returns validation success object if input is true",function(done){
      var o = { random_property:"A random property"}
      discussionDecision.returnObectIfTrue(Promise.resolve(o),new BadUserInput("DiscussionId Already Taken")).then(r=>{
        assert(r,"Failure returned when input was true")
        assert(Object.is(r,o),"wrong object returned")
        done()
      })
    })

    it("returns failure object if input is false",function(done){
      var o = {random_property:"A random property"}
      var failureObject = new BadUserInput("DiscussionId Already Taken")

      discussionDecision.returnObectIfTrue(Promise.resolve(false),failureObject).catch(e=>{
        assert(e.code===400,"wrong error code")
        assert(Object.is(e,failureObject),"Wrong object returned as failure")
        done()
      })
    })

    it("returns true when promise result doesn't exist",function(done){
      var result = discussionDecision.promiseResultDoesNotExist(Promise.resolve()).then(r=>{
        assert(r,"false returned")
        done()
      })
    })
    it("returns false when promise result exists",function(done){
      var result = discussionDecision.promiseResultDoesNotExist(Promise.resolve({})).then(r=>{
        assert(!r,"True returned when false expected")
        done()
      })
    })

    it("converts a discussion to data storage sets",function(){
      var d={
        discussionId:"myId",
        userId:"userId",
        keywords:["dancing","music","politics"],
        language:"french",
        location:"France",
        discussionTitle:"This is a title",
        key: "sfsfsfsf"
      }
      var storageSets = discussionDecision.convertDiscussionToStorageSets(d)
      var compare =[{"table":"discussion","data":{"discussionId":"myId","discussionTitle":"This is a title","language":"french","location":"France","userId":"userId","key":"sfsfsfsf"}},{"table":"topic","data":{"name":"dancing","discussionId":"myId","language":"french","location":"France"}},{"table":"topic","data":{"name":"music","discussionId":"myId","language":"french","location":"France"}},{"table":"topic","data":{"name":"politics","discussionId":"myId","language":"french","location":"France"}}]

      var x = JSON.stringify(storageSets)
      //console.log(x+"\r\n")
      var y = JSON.stringify(compare)
      //console.log(y+"\r\n")
      assert(Object.is(x,y),"Snapshots don't match")
    })

    it("creates a keywords string including the word And",function(){
      var d={
        discussionId:"myId",
        keywords:["dancing","music","politics"]
      }
      var result = discussionDecision.createKeywordsStringWithAnd(d)
      assert(result==="dancing, music, and politics","wrong string")
      //console.log(result)
    })

    it("creates a keywords string without the word And",function(){
      var d={
        discussionId:"myId",
        keywords:["dancing","music","politics"]
      }
      var result = discussionDecision.createKeywordsStringWithoutAnd(d)
      assert(result==="dancing, music, politics","wrong string")
    })

    it("creates a date value for meta tags",function(){
      var d={
        discussionId:"myId",
        keywords:["dancing","music","politics"],
        updateTime: 67574
      }
      var result = discussionDecision.createDate(d)
      assert(result==="Wed Dec 31 1969 19:01:07 GMT-0500 (EST)","wrong time")
      //console.log(result)
    })

    it("creates a last modified date for meta tags",function(){
      var d={
        discussionId:"myId",
        keywords:["dancing","music","politics"],
        updateTime: 674574
      }
      var result = discussionDecision.createLastMod(d)
      assert(result==="Wed Dec 31 1969 19:11:14 GMT-0500 (EST)","wrong time")
      //console.log(result)
    })


})
