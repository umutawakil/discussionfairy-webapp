const container          = require("../../../dependency_injection/container").init()
container.loadFakes()

const webWriterService = require("../../../services/web.writer.services.js")
const BadUserInput     = require("../../../types/responses/bad.user.input.js")
const assert           = require('chai').assert
const logger           = require("../../../shared/logger.js")
process.env.testing    = true

//BUg causes unhandledRejection to be thrown when Promise.Rejection is used in async funcitons
//so I had to write a mock
var rejection = {
  input:{},
  catch: function(callback){
    callback(rejection.input)
  }
}


  describe("Web Writer Service:",function(){
      var json
      var send
      var status

      beforeEach(()=>{
        json = undefined
        send = undefined
        status = undefined
      })

      var res = {
        json: function(x){
          json = x
        },
        send: function(x){
          send = x
        },
        status: function(x){
          status = x
        }
      }

      it("writes a json object when input is a success validation",function(done){

        var input = {
          name:"test"
        }
        webWriterService.json(Promise.resolve(input),res).then(r=>{
          assert(json===input,"Valid input was not written as JSON")
          done()

        }).catch(e=>{
          console.log(e)
          done(e)
        })
      })

      it("writes a plain text message when input is a success validation",function(done){

        webWriterService.send(Promise.resolve("something"),res).then(r=>{
          assert(send==="something","Valid input was not written as text")
          done()

        }).catch(e=>{
          console.log(e)
          done(e)
        })
      })

      it("writes a error object when input is a failure validation for expected",function(done){
        rejection.input = new BadUserInput("user error")
        webWriterService.json(rejection,res).then(r=>{
          assert(!json,"json sent when input was a failed validation")
          assert(status===400,"bad user input error code not sent")
          assert(send==="user error","error message not sent to user")
          done()

        }).catch(e=>{
          console.log(e)
          done(e)
        })
      })

      it("writes a error object when input is a failure validation",function(done){
        rejection.input = new BadUserInput("user error")

        webWriterService.send(rejection,res).then(r=>{
          assert(!json,"json sent when input was a failed validation")
          assert(status===400,"bad user input error code not sent")
          assert(send==="user error","error message not sent to user")
          done()

        }).catch(e=>{
          console.log(e)
          done(e)
        })
      })

      it("writes a 500 error object when input is an async failure validation",function(done){
        var input = {
          message: "bad something",
          code: 500,
          error: new Error("Crash Test Ignore")
        }
        rejection.input = input
        //var validation = Promise.reject(input)
        webWriterService.json(rejection,res).then(()=>{
          assert(!json,"json sent when input was a failed validation")
          assert(status===500,"500 error code not sent")
          assert(send.includes(input.error.stack),"error message not sent to user")
          done()

        }).catch(e=>{
          console.log(e)
          done(e)
        })
      })

      it("writes a 500 error object when input is an async failure validation with an error code",function(done){
        var error = {
          message: "Bad request from database",
          code: 500
        }
        rejection.input = error
        //var validation = Promise.reject(error)
        webWriterService.json(rejection,res).then(()=>{
          assert(!json,"json sent when input was a failed validation")
          assert(status===500,"500 error code not sent")
          done()

        }).catch(e=>{
          console.log(e)
          done(e)
        })
      })

      it("returns HTTP code 500 and a stack trace when an error is input",function(){
        var error = new Error("test trace")
        webWriterService.sendErrorResponse(error,res)
          assert(!json,"sent json on error")
          assert(status === 500, "Wrong error returned")
          assert(send.includes("test trace"),"stack trace not included")

      })
      it("includes custom message in response to user when custom message is present",function(){
        var error = new Error("test trace")
        error.message = "some details"
        webWriterService.sendErrorResponse(error,res)
        assert(send.includes("some details"),"Custom message not included in error response")

      })
  })

  /*process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });

  process.on('unhandledRejection', (reason, p) => {
    logger.logX('Unhandled Rejection at: Promise'+p+", "+reason+":, "+reason)
  });*/
