const container          = require("../../../dependency_injection/container").init()
container.loadFakes()

const searchService = require("../../../services/search.services.js")
const assert        = require('chai').assert

describe("Search Service:",function(){
    //var rdsService = searchService.getRDSService()

    it("Search for discussions",function(done){
      var criteria = {
        location: "",
        language:"",
        topic:""
      }
      /*var fakeResponse = {
        data: "random"
      }*/
      //searchService.setRDSService(createMockSearch(fakeResponse))
      searchService.searchDiscussions(criteria).then(r=>{
        assert(r, "invalid response")
        //assert(Object.is(fakeResponse,r),"Wrong response object returned")
        done()

      }).catch(e =>{
        console.log(e)
        done(e)
      })
    })

    it("retrieves a discussion from a list/array of select results",function(done){
      var data = {
        name: "random"
      }
      //var fakeResponse = [data]
      //searchService.setRDSService(createMockSearch(fakeResponse))
      searchService.getDiscussion("testDiscussionId").then(r=>{
        //assert(Object.is(data,r),"Wrong response object returned")
        done()

      }).catch(e => {
        console.log(e)
        done(e)
      })
    })

    it("Search for discussions with a particular topic",function(done){
      var criteria = {
        location: "",
        language:"",
        topic:"War"
      }
      /*var fakeResponse = {
        data: "random"
      }*/
      //searchService.setRDSService(createMockSearch(fakeResponse))
      searchService.searchDiscussions(criteria).then(r=>{
        //assert(Object.is(fakeResponse,r),"Wrong response object returned")
        done()
      })
    })

    it("Search for topics",function(done){
      var criteria = {
        location: "",
        language:""
      }
      /*var fakeResponse = {
        data: "random"
      }*/
      //searchService.setRDSService(createMockSearch(fakeResponse))
      searchService.searchTopics(criteria).then(r=>{
        //assert(Object.is(fakeResponse,r),"Wrong response object returned")
        done()
      })
    })

    it("Display all languages in a particular",function(done){
      var criteria = {
        location: "France"
      }
      /*var fakeResponse = {
        data: ["language1","languag2"]
      }*/
      //searchService.setRDSService(createMockSearch(fakeResponse))
      searchService.getLanguagesInLocation(criteria).then(r=>{
        //assert(Object.is(fakeResponse,r),"Wrong response object returned")
        assert(r,"invalid response")
        done()
      })
    })
    it("Display all locations",function(done){
      searchService.getAllLocations().then(r=>{
        assert(r,"invalid response")
        done()
      })
    })

    it("Update Search Service",function(done){
      var discussion = {
        discussionId:"sfsf",
        location: "sfsfs",
        language:"sfsfsf",
        keywords:["a","b","c"],
        updateTime: new Date().getTime()
      }
      //searchService.setRDSService(createMockSearch())
      searchService.updateWithNewDiscussion(discussion).then(()=>{
        done()
      })
    })

    it("Update Search Service from comment",function(done){
      //searchService.setRDSService(createMockSearch())
      searchService.updateFromComment("discussionId").then(()=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    it("propagate vote",function(done){
      //searchService.setRDSService(createMockSearch())
      searchService.propagateVote("someUserId","discussionId").then(()=>{
        done()
      }).catch(e=>{
        console.log(e)
        done(e)
      })
    })

    //searchService.setRDSService(rdsService)
})

/*function createMockSearch(response){
  var mock = {
    preparedStatement: function(parameters){
      return Promise.resolve(response)
    },
    storeDataSets: function(parameters){
      return Promise.resolve()
    }
  }
  return mock
}*/
