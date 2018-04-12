const ChildType = require("../../../types/child.type")
const expect    = require('chai').expect
const assert    = require('chai').assert

describe("Child Type:",function(){

  it("returns false when all fields missing",function(){
      var kid = new ChildType()
      assert(kid.validate(ChildType).valid === false,"Returned true on an empty child")
  })

  it("returns true when all required fields are defined",function(){
      var kid = new ChildType()
      kid.age = 5
      kid.height = "6ft"
      kid.name = "Susan"
      assert(kid.validate(ChildType).valid === true,"Returned false on a fully defined child")
  })

  it("returns false when a required field is missing",function(){
      var kid = new ChildType()
      kid.age = 5
      kid.name = "Susan"
      assert(kid.validate(ChildType).valid === false,"Returned true on a partially defined child")
  })

  it("returns false compared against the wrong type",function(){
      var kid = new ChildType()
      kid.age = 5
      kid.height = "6ft"
      kid.name = "Susan"
      assert(kid.validate(String).valid === false,"Returned true on a partially defined child")
  })


})
