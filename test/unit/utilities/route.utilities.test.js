const routeUtility  = require("../../../utilities/route.utilities.js")
const superTest     = require('supertest')
const expect        = require('chai').expect
const assert        = require('chai').assert
const logger        = require("../../../shared/logger.js")
//const security      = require("../../../services/security.services.js")

//security.disable()
logger.disable()

describe("Route Utilities:",function(){
  var pair = routeUtility.getNextAndPreviousPageNumber("8")

  it("Creates previousPage value",function(){
      assert(pair.previousPage === 7," Incorrect previous page: "+pair.previousPage)
  })

  it("Given 0 calculates 1 for nextPage but keeps previousPage undefined",function(){
      pair = routeUtility.getNextAndPreviousPageNumber("0",true)
      assert(pair.nextPage === 1, "Incorrect next page:"+pair.nextPage)
      assert(typeof pair.previousPage === "undefined","Previous page is defined when on 1st page")
  })

  it("For page 1 correct next and previous pages are calculated",function(){
      pair = routeUtility.getNextAndPreviousPageNumber("1",true)
      assert(pair.nextPage === 2, "Incorrect next page:"+pair.nextPage)
      assert(pair.previousPage === 0, "Incorrect Previous Page: "+pair.previousPage)
  })

  it("For any page if no elements are found there should be no nextPage",function(){
      pair = routeUtility.getNextAndPreviousPageNumber("1",false)
      assert(typeof pair.nextPage == "undefined", "Incorrect next page:"+pair.nextPage)
      assert(pair.previousPage === 0, "Incorrect Previous Page: "+pair.previousPage)
  })

  it("can detect mobile browser",function(){
    routeUtility.mobileAgents.forEach(function(x){
      var req = {
        headers: {
          "user-agent": x
        }
      }
      assert(routeUtility.isMobileRequest(req),"Failed to detect Mobile request")
    })
  })

  it("can detect a non mobile browser",function(){
    var req = {
      headers: {
        "user-agent": "some browser"
      }
    }
    assert(!routeUtility.isMobileRequest(req),"returned true on a non mobile browser")

  })
})

function MockResponse(){
}
MockResponse.prototype.status = function(code){
  this.code = code
};
MockResponse.prototype.send =  function(message){
  this.message = message
}

function validRequestFunction(){
  var requestFunc = function(){
    var promise = new Promise(function(resolve,reject){
      resolve()
    })
    return promise
  };

  return requestFunc
}
function errorThrowingRequestFunction(){
  var requestFunc = function(){
    var promise = new Promise(function(resolve,reject){
      throw new Error()
      resolve()
    })
    return promise
  };

  return requestFunc
}
function validSuccessFunction(req,res,done){
  var successFunc = function() {
    assert(typeof res.code === 'undefined', "Status has been set: "+res.code)
    done()
  }
  return successFunc
}
