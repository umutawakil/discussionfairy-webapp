const ResponseData = require("../../../shared/response-data.js")
const assert       = require('chai').assert

process.env.RecordingSourceURL = "SFSFSFSFSFSF"

describe("Response Data:",function(){

  var req = {
    headers: {
      authentication:"Bearer XXXXXXXXXX",
      "user-agent": "a mobile browser"
    }
  }
  var res = {}

  it("creates a StandardViewResult",function(){
      var data = new ResponseData.StandardViewResult(req,res)
      assert(data,"Unable to create StandardViewResult")
  })
  it("creates a DiscussionListResult",function(){
      var data = new ResponseData.DiscussionListResult()
      assert(data,"Unable to create DiscussionListResult")
  })
})
