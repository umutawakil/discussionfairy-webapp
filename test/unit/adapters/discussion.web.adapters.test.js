const discussionWebAdapter = require("../../../adapters/discussion.web.adapters.js")
const assert               = require('chai').assert

//TODO: Lots of redundant code here but under the gun I had to copy and paste.

describe("Discussion Web Adapter:",function(){

    function FakeRequest() {
      return {
        userId:"sfsfxxxxxxxx",
        body: {
          discussionId:"sfsfsfsfsf",
          discussionTitle:"sfsfsf",
          keywords:["asfsf","sfs","sfsf"],
          location:"sfsfsfsf",
          language:"sfsfsfsfsf",
          extension:"m4a",
        }
      }
    }

    it("can handle undefined input on request",function(done){
      discussionWebAdapter.parseDiscussionUploadFormRequest().catch(e=>{
        assert(e.code===400,"wrong error code returned")
        assert(e.message,"no error message returned")
        done()
      })
    })

    it("can handle undefined input on request.params",function(done){
      var req = { }
      var result = discussionWebAdapter.parseDiscussionUploadFormRequest(req)
      result.catch(e=>{
        assert(e.code===400,"wrong error code returned")
        assert(e.message,"no error message returned")
        done()
      })
    })

    it("creates a discussion upload form request from a valid web request",function(done){
       discussionWebAdapter.parseDiscussionUploadFormRequest(new FakeRequest()).then(r=>{
        assert(r.userId,"missing userId")
        assert(r.discussionId,"missing discussionId")
        assert(r.discussionTitle,"missing discussionTitle")
        assert(r.keywords,"missing keywords")
        assert(r.location,"missing location")
        assert(r.language,"missing language")
        assert(r.key,"missing key")
        assert(r.popularity===0,"missing popularity")
        assert(r.likes===0,"missing likes")
        assert(r.dislikes===0,"missing dislikes")
        assert(r.comments===0,"missing comments")
        assert(r.creationTime,"missing creationTime")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
    })

    it("It rejects request objects that dont have every required field defined",function(done){
      var req = {
          userId:"sfsfxxxxxxxx",
          body: {
            discussionId:"sfsfsfsfsf",
            discussionTitle:"sfsfsf"
          }
      }
      discussionWebAdapter.parseDiscussionUploadFormRequest({}).catch(e=>{
        assert(e.code===400,"wrong error code")
        assert(e.message,"no error message returned")
        done()
      })
    })

    it("It rejects invalid discussionId",function(done){
      var req = new FakeRequest()
      req.body.discussionId = undefined


      discussionWebAdapter.parseDiscussionUploadFormRequest(req).catch(e=>{
        assert(e.code===400,"wrong error code")
        assert(e.message.includes("discussionId"),"discussionId error missing")
        done()
      })
    })

    it("It rejects invalid keywords",function(done){
      var req = new FakeRequest()
      req.body.keywords = ["asfsf","sfs","sfsfsfsffsfssfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffff"]

      discussionWebAdapter.parseDiscussionUploadFormRequest(req).catch(e=>{
        assert(e.code===400,"wrong error code")
        assert(e.message.includes("keyword"),"keyword error missing")
        done()
      })
    })

    it("It rejects invalid discussionTitle",function(done){
      var req = new FakeRequest
      req.body.discussionTitle = "sfsfsfsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsff"
      discussionWebAdapter.parseDiscussionUploadFormRequest(req).catch(e=>{
        assert(e.code===400,"wrong error code")
        assert(e.message.includes("title"),"discussionTitle error missing")
        done()
      })
    })

    it("It rejects invalid language",function(done){

      var req = {
          userId:"sfsfxxxxxxxx",
          body: {
            discussionId:"sfsfsfsfsf",
            discussionTitle:"sfsfsf",
            keywords:["asfsf","sfs","sfsf"],
            location:"sfsfsfsf",
            language:"sfsfsfsfsfsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsff",
            extension:"m4a"
          }
      }

      discussionWebAdapter.parseDiscussionUploadFormRequest(req).catch(e=>{
        assert(e.code===400,"Wrong error code")
        assert(e.message.includes("language"),"language error missing")
        done()
      })
    })

    it("It rejects invalid location",function(done){

      var req = {
          userId:"sfsfxxxxxxxx",
          body: {
            discussionId:"sfsfsfsfsf",
            discussionTitle:"sfsfsf",
            keywords:["asfsf","sfs","sfsf"],
            location:"sfsfsfsfsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsffsfsfsfsffsfsff",
            language:"sfsfsfsfsf",
            extension:"m4a"
          }
      }

      discussionWebAdapter.parseDiscussionUploadFormRequest(req).catch(e=>{
        assert(e.code===400,"Wrong error code")
        assert(e.message.includes("location"),"location error missing")
        done()
      })
    })

    it("It rejects invalid userId",function(done){
      var req = {
          body: {
            discussionId:"sfsfsfsfsf",
            discussionTitle:"sfsfsf",
            keywords:["asfsf","sfs","sfsf"],
            location:"sfsfsfsf",
            language:"sfsfsfsfsf",
            extension:"m4a"
          }
      }

      discussionWebAdapter.parseDiscussionUploadFormRequest(req).catch(e=>{
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
            discussionTitle:"sfsfsf",
            keywords:["asfsf","sfs","sfsf"],
            location:"sfsfsfsf",
            language:"sfsfsfsfsf",
            extension:"m4af"
          }
      }
      var result = discussionWebAdapter.parseDiscussionUploadFormRequest(req).catch(e=>{
        assert(e.code===400,"Wrong error code")
        assert(e.message.includes("extension"),"extension error missing")
        done()
      })
    })

})
