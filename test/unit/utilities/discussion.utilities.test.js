const discussionUtility = require("../../../utilities/discussion.utilities")
const sharedUtility     = require("../../../shared/utilities")
const assert            = require('chai').assert

describe("Discussion Utility:",function(){

  it("creates a key that is URL safe",function(done){
    var info = { discussionId: "xxxxxxxx", extension: "mp3"}
    var key  = discussionUtility.createKey(info)

    assert(sharedUtility.isURLSafe(key) == true,"Invalid key created")
    done()
  })
})
