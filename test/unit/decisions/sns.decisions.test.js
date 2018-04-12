const snsDecision = require("../../../decisions/sns.decisions.js")
const assert           = require('chai').assert

describe("SNS Decisions:",function(){
    it("Returns a rejection when the callback function has an error object present",function(done){
      var reject,resolve
      var promise = new Promise((x,y)=>{
        resolve = x
        reject = y
      })
      var error={}
      var callback = snsDecision.createStandardResponseCallback(resolve,reject)
      callback(error,{})

      promise.catch(v=>{
        assert(v.code===500,"Wrong error code")
        assert(v.message,"No error message returned")
        assert(v.error===error,"Error object not returned ")
        done()
      })
    })

    it("Returns a promise resolve when the callback function has no error object present",function(done){
      var reject,resolve
      var promise = new Promise((x,y)=>{
        resolve = x
        reject = y
      })
      var error=undefined
      var response = {name:"cat"}
      var callback = snsDecision.createStandardResponseCallback(resolve,reject)
      callback(error,response)

      promise.then(r=>{
        assert(r.name==="cat","Wrong object returned")
        done()
      })
    })
})
