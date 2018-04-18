const container       = require("../../../dependency_injection/container").init()
container.loadFakes()
const dynamodbService = require("../../../services/dynamodb.services.js")
const assert          = require('chai').assert
//const sinon           = require("sinon")

describe("DynamoDB Service:",function(){
  //var dynamodb = dynamodbService.getDynamoDB()

  it("saves a simple object",function(done){
    var response = {
        Item:{
          data: "xxxxxxx"
        }
    }
    //var mock = createMock("putItem",undefined,response)
    //dynamodbService.setDynamoDB(mock)
    dynamodbService.simpleObjectSave({something:"sfsf"},"some_location").then(r=>{
      assert(r,"Invalid response")
      done()
    })
  })

  //Handled by internal decision block
  /*it("calls its catch block when error is present",function(done){
    var response = {
        Item:{
          data: "xxxxxxx"
        }
    }
    var error = {
      value :"error message"
    }
    var mock = createMock("putItem",error,response)
    dynamodbService.setDynamoDB(mock)
    dynamodbService.simpleObjectSave({something:"sfsf"},"some_location").catch(e=>{
      assert(e.error===error,"Response value does not match input")
      assert(e.code===500,"No error code returned")
      assert(e.message,"No message returned")
      done()
    })
  })*/

  it("retrieves an object",function(done){
    var response = {
        Item:{
          data: "xxxxxxx"
        }
    }
    //var mock = createMock("getItem",undefined,response)
    //dynamodbService.setDynamoDB(mock)
    var p = dynamodbService.simpleObjectGet({something:"sfsf"},"some_location")
    p.then(r=>{
      assert(r,"Response is undefined")
      done()
    })
  })

  /*it("calls its catch block when error is present",function(done){
    var response = {
        Item:{
          data: "xxxxxxx"
        }
    }
    var error = {
      value :"error message"
    }
    //var mock = createMock("getItem",error,response)
    //dynamodbService.setDynamoDB(mock)
    var p = dynamodbService.simpleObjectGet({something:"sfsf"},"some_location")
    p.catch(e=>{
      assert(e.error===error,"Response value does not match input")
      assert(e.code===500,"No error code returned")
      assert(e.message,"No message returned")
      done()
    })
  })*/

  it("deletes an object",function(done){
    var response = {
        Item:{
          data: "xxxxxxx"
        }
    }
    //var mock = createMock("deleteItem",undefined,response)
    //dynamodbService.setDynamoDB(mock)
    dynamodbService.simpleObjectDelete({something:"sfsf"},"some_location").then(r=>{
      assert(r,"Response invalid")
      done()
    })
  })
  /*it("calls its catch block when error present",function(done){
    var response = {
        Item:{
          data: "xxxxxxx"
        }
    }
    var error = {
      value :"error message"
    }
    var mock = createMock("deleteItem",error,response)
    dynamodbService.setDynamoDB(mock)
    dynamodbService.simpleObjectDelete({something:"sfsf"},"some_location").catch(e=>{
      assert(e.error===error,"Response value does not match input")
      assert(e.code===500,"No error code returned")
      assert(e.message,"No message returned")
      done()
    })
  })*/

  it("gets comments",function(done){
    /*var response = {
      Items: [
        {data:{S:"some_data"}}
      ]
    }*/
    //var mock = createMock("query",undefined,response)
    //dynamodbService.setDynamoDB(mock)
    dynamodbService.getComments("discussionId").then(r=>{
      //assert(r[0].data==="some_data","Response value does not match input")      
      done()
    }).catch(e=>{
      console.log(e)
      done(e)
    })
  })

  /*it("rejects when error present",function(done){
    var response = {
      Items: [
        {data:{S:"some_data"}}
      ]
    }
    var error = {prop:"some_prop"}
    var mock = createMock("query",error,response)
    dynamodbService.setDynamoDB(mock)
    dynamodbService.getComments("discussionId").catch(e=>{
      assert(e,"No error returned")
      done()
    })
  })

  dynamodbService.setDynamoDB(dynamodb)*/
})

/*function createMock(functionName,error,response){
  var mock = {}
  mock[functionName] = function(params,callback){
    callback(error,response)
  }
  return mock
}*/
