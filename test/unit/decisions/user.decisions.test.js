const userDecisions = require("../../../decisions/user.decisions.js")
const assert        = require('chai').assert
const settings      = require("../../../settings.json")

describe("User Decisions",function(){

  it("rejects an empty userId",function(){
      assert(!userDecisions.isUserIdFormatValid(""),"Empty userId accepted")
  })

  it("rejects a very long userId",function(){
    var x = []
    for(var i=0; i < settings.maxUserIdLength + 1; i++){
      x.push("a")
    }
    assert(!userDecisions.isUserIdFormatValid(x.toString()),"Overly long userId accepted")
  })

  it("it accepts a valid userId",function(){
      assert(userDecisions.isUserIdFormatValid("xxsdfsfsfsfsfsfsfsfsfsfs"),"Overly long userId accepted")
  })
})
