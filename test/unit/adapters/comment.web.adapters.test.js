const commentWebAdapter = require("../../../adapters/comment.web.adapters.js")
const assert            = require('chai').assert

//TODO: Lots of redundant code here but under the gun I had to copy and paste.

describe("Comment Web Adapter:",function(){

    function FakeRequest() {
      return {
        userId:"sfsfxxxxxxxx",
        body: {
          discussionId:"sfsfsfsfsf",
          extension:"m4a"
        }
      }
    }

    it("can handle undefined input on request",function(done){
      commentWebAdapter.parseCommentUploadFormRequest().catch(e=>{
        assert(e.code===400,"wrong error code returned")
        assert(e.message,"no error message returned")
        done()
      })
    })

    it("can handle undefined input on request.params",function(done){
      var req = { }
      var result = commentWebAdapter.parseCommentUploadFormRequest(req)
      result.catch(e=>{
        assert(e.code===400,"wrong error code returned")
        assert(e.message,"no error message returned")
        done()
      })
    })

    it("creates a comment upload form request from a valid web request",function(done){
       commentWebAdapter.parseCommentUploadFormRequest(new FakeRequest()).then(r=>{
        assert(r.userId,"missing userId")
        assert(r.discussionId,"missing discussionId")
        assert(r.key,"missing key")
        assert(r.creationTime,"missing creationTime")
        assert(r.updateTime,"missing updateTime")
        done()
      })
    })

    it("It rejects request objects that dont have every required field defined",function(done){
      var req = {
          userId:"sfsfxxxxxxxx",
          body: {
            discussionId:"sfsfsfsfsf",
          }
      }
      commentWebAdapter.parseCommentUploadFormRequest(req).catch(e=>{
        assert(e.code===400,"wrong error code")
        assert(e.message,"no error message returned")
        done()
      })
    })

    it("It rejects invalid discussionId",function(done){
      var req = new FakeRequest()
      req.body.discussionId = undefined

      commentWebAdapter.parseCommentUploadFormRequest(req).catch(e=>{
        assert(e.code===400,"wrong error code")
        assert(e.message.includes("discussionId"),"discussionId error missing")
        done()
      })
    })

    it("It rejects invalid userId",function(done){
      var req = {
          body: {
            discussionId:"sfsfsfsfsf",
            extension:"m4a"
          }
      }

      commentWebAdapter.parseCommentUploadFormRequest(req).catch(e=>{
        assert(e.code===400,"Wrong error code")
        assert(e.message.includes("userId"),"userId error missing")
        done()
      })
    })

    it("It rejects invalid extension",function(done){
      var req = {
          userId:"sfsfxxxxxxxx",
          body: {
            discussionId:"sfsfsfsfsf",
            extension:"m4af"
          }
      }
      var result = commentWebAdapter.parseCommentUploadFormRequest(req).catch(e=>{
        assert(e.code===400,"Wrong error code")
        assert(e.message.includes("extension"),"extension error missing")
        done()
      })
    })

})
