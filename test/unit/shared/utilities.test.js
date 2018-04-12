const sharedUtility = require("../../../shared/utilities.js")
const expect        = require('chai').expect
const assert        = require('chai').assert

describe("Shared Utilities:",function(){

  it("Returns true for valid number",function(){
      assert(sharedUtility.isNumber("5") === true,"Cannot detect '5' as a valid number")
  })

  it("Returns false for invalid number",function(){
      assert(sharedUtility.isNumber("A") === false,"Cannot detect 'A' as an invalid number")
  })

  it("Returns false for undefined",function(){
      assert(sharedUtility.isNumber() === false,"Cannot detect undefined as an invalid number")
  })

  it("Returns true for integer zero input",function(){
      assert(sharedUtility.isNumber(0) === true,"Cannot detect integer 0 as an invalid number")
  })

  it("returns true when all properties of a comparison object are defined",function(){
      var objectA = {
        A:"something",
        B:"sfsfsfsf"
      }
      var objectB = {
        A:"bsfsfs",
        B:"fsfs"
      }
      assert(sharedUtility.checkAllPropertiesDefined(objectA,objectB) === true,"Incorrectly returned false on fully defined object")
  })

  it("returns false when some properties on a comparison object are not defined",function(){
    var objectA = {
      A:"something",
    }
    var objectB = {
      A:"bsfsfs",
      B:"fsfs"
    }
    assert(sharedUtility.checkAllPropertiesDefined(objectA,objectB) === false ,"Incorrectly returned true on partially defined object")
  })

  it("returns a random UUID",function(){
    var x = sharedUtility.generateUUID()
    assert(x,"no data returned")
  })

  it("detects URL-unsafe characters",function(){
    assert(!sharedUtility.isURLSafe("\"{]gyg}"),"Failed to detect URL unsafe character(s)")
    assert(!sharedUtility.isURLSafe("{"),"Failed to detect URL unsafe character(s)")
    assert(!sharedUtility.isURLSafe("}"),"Failed to detect URL unsafe character(s)")
    assert(!sharedUtility.isURLSafe("^"),"Failed to detect URL unsafe character(s)")
    assert(!sharedUtility.isURLSafe("?~\""),"Failed to detect URL unsafe character(s)")
  })

  it("detects URL-safe characters A",function(){
    assert(sharedUtility.isURLSafe(sharedUtility.URLSafeCharacters.join()),"Failed to detect safe character(s)")
  })

})
