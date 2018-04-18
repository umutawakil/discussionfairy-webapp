//const sinon        = require("sinon")
const container      = require("../../../dependency_injection/container").init()
container.loadFakes()
const inboxService   = require("../../../services/inbox.services.js")
//const rdsService     = require("../../../services/rds.services.js")
const assert         = require('chai').assert

describe("Inbox Service:",function(){
    /*var preparedStatementStub;
    beforeEach(function(){
      preparedStatementStub = sinon.stub(rdsService,"preparedStatement");
      preparedStatementStub.callsFake(()=>{
       return Promise.resolve({})
     })
    })
    afterEach(function(){
      preparedStatementStub.restore()
    })*/

    it("Send New Notification to available inbox subscribers",function(done){
      var userId       = "3833300"
      var discussionId = "45755848"
      inboxService.sendNewCommentNotifications(userId,discussionId).then(r=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("Subscribe to Discussion",function(done){
      inboxService.subscribeToDiscussion("testUserId","testDiscussionId").then(r=>{
        assert(r,"no response returned")
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("Unsubscribe from Discussion",function(done){
      inboxService.unsubscribe("testUserId","testDiscussionId").then(r=>{
        assert(r,"no response returned")
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })


    it("Returns the count of an individual inbox",function(done){
    /*  preparedStatementStub.restore()
      preparedStatementStub = sinon.stub(rdsService,"preparedStatement");
      preparedStatementStub.callsFake(()=>{
       return Promise.resolve([{count: 5}])
     })*/

      inboxService.count("testUserId").then(r=>{
        //assert(r.count === 5,"no response returned")
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("Retrieves a users inbox",function(done){
      inboxService.get("testUserId").then(r=>{
        assert(r,"no response returned")
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("Delete",function(done){
      var userId = "testUserId"
      var discussionId = "testDiscussionId"

      inboxService.delete(userId,discussionId).then(r=>{
        assert(r,"no response returned")
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })
})
