const dynamodbDecision = require("../../../decisions/dynamodb.decisions.js")
const assert           = require('chai').assert
const IPromise         = require("../../../types/responses/i.promise.js")

describe("DynamoDB Decisions:",function(){
    it("Returns a validation object when the callback function has an error object present",function(done){
      var reject,resolve
      var promise = new Promise((x,y)=>{
        resolve = x
        reject = y
      })
      var error={}
      var callback = dynamodbDecision.standardCallback(resolve,reject)
      var result = callback(error,{})
      promise.catch(v=>{
        assert(v.code===500,"Wrong error code")
        assert(v.message,"No error message returned")
        assert(v.error===error,"Error object not returned ")
        done()
      })
    })

    it("Returns a validation object when the callback function has an error nested in the response object",function(done){
      var reject,resolve
      var promise = new Promise((x,y)=>{
        resolve = x
        reject = y
      })
      var error=undefined
      var callback = dynamodbDecision.standardCallback(resolve,reject)
      var response = {
        error:"some error"
      }
      var result = callback(error,response)
      promise.catch(v=>{
        assert(v.code===500,"Wrong error code")
        assert(v.message,"No error message returned")
        assert(v.error==="some error","Error object not returned ")
        done()
      })
    })

    it("Returns catch when no data is present",function(done){
      var reject,resolve
      var promise = new Promise((x,y)=>{
        resolve = x
        reject = y
      })
      var error=undefined
      var response = undefined
      var callback = dynamodbDecision.standardCallback(resolve,reject)
      var result = callback(error,response)
      promise.catch(v=>{
        assert(v.code===500,"Wrong error code")
        assert(v.message,"No error message returned")
        assert(v.error===error,"Error object not returned ")
        done()
      })
    })

    it("Returns response object when the callback function has no error object present",function(done){
      var reject,resolve
      var promise = new Promise((x,y)=>{
        resolve = x
        reject = y
      })
      var error=undefined
      var response = {name:"cat"}
      var callback = dynamodbDecision.standardCallback(resolve,reject)
      var result = callback(error,response)
      promise.then(r=>{
        assert(r.name==="cat","success object not returned")
        done()
      })
    })

    it("Returns no error when response object is empty but defined",function(done){
      var reject,resolve
      var promise = new Promise((x,y)=>{
        resolve = x
        reject = y
      })
      var error=undefined
      var response = {}
      var callback = dynamodbDecision.standardCallback(resolve,reject)
      var result = callback(error,response)
      promise.then(r=>{
        done()
      })
    })

    it("Returns response object when Item is present",function(){
      var response = {
        Item:{ name: {S:"cat"}}
      }
      var result = dynamodbDecision.formatGetItemResponse(response)
      assert(result.name==="cat","success object not returned")
    })

    it("Returns undefined when Item is undefined",function(){
      var response = {}
      var result = dynamodbDecision.formatGetItemResponse(response)
      assert(!result,"returned true when Item was not present")
    })

    it("Returns undefined when the full input is undefined",function(){
      var result = dynamodbDecision.formatGetItemResponse()
      assert(!result,"returned true when Item was not present")
    })

    it("Returns an application error when the callback function has an error object present",function(done){
      var ip = new IPromise()
      var error={}
      var response = {
        Items: [
          {one:"1"},
          {two:"2"},
          {threw:"3"}
        ]
      }
      var callback = dynamodbDecision.multipleResultsCallback(ip.resolve,ip.reject)
      var result = callback(error,response)
      ip.promise.catch(r=>{
        assert(r.code===500,"Wrong error code")
        assert(r.message,"No error message returned")
        assert(r.error===error,"Error object not returned ")
        done()
      })
    })

    it("Returns an resolve when the callback function has no error object present",function(done){
      var ip = new IPromise()
      var error=undefined
      var response = {
        Items: [
          {v:{S:"1"}},
          {v:{S:"2"}},
          {v:{S:"3"}}
        ]
      }
      var ip = new IPromise()
      var callback = dynamodbDecision.multipleResultsCallback(ip.resolve,ip.reject)
      callback(error,response)
      ip.promise.then(r=>{
        assert(r[0].v==="1","response data parsed incorrectly")
        assert(r[1].v==="2","response data parsed incorrectly")
        assert(r[2].v==="3","response data parsed incorrectly")
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    //TODO: Leaving for a while as examples of how to use IPromise
    /*it("Returns an application error when the callback function has an error object present",function(done){
      var ip = new IPromise()
      var error={}
      var response = {
        Items: [
          {one:"1"},
          {two:"2"},
          {threw:"3"}
        ]
      }
      var callback = dynamodbDecision.countInboxCallback(ip.resolve,ip.reject)
      var result = callback(error,response)
      ip.promise.catch(r=>{
        assert(r.code===500,"Wrong error code")
        assert(r.message,"No error message returned")
        assert(r.error===error,"Error object not returned ")
        done()
      })
    })

    it("Returns a count of the number of results when the callback function has no error object present",function(done){
      var ip = new IPromise()
      var error=undefined
      var response = {
        Items: [
          {count:{S:"5"}},
          {count:{S:"2"}},
          {count:{S:"3"}}
        ]
      }
      var ip = new IPromise()
      var callback = dynamodbDecision.countInboxCallback(ip.resolve,ip.reject)
      callback(error,response)
      ip.promise.then(r=>{
        assert(r.count===10,"response data parsed incorrectly")
        done()

      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })*/
})
