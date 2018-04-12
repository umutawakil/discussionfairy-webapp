const rdsDecision = require("../../../decisions/rds.decisions")
const assert      = require('chai').assert
const settings    = require("../../../settings.json")

describe("RDS Decisions:",function(){
    it("Returns a rejection with a 500 error code when error object is present in formatConnectionResponse",function(done){
      var error={}
      rdsDecision.formatGenericResponse(error,{}).catch(e=>{
        assert(e.message,"No failure message present")
        assert(e.code===500,"incorrect error code")
        assert(Object.is(e.error,error),"Wrong object returned")
        done()
      })
    })

    it("Returns a promise resolve when no error in formatConnectionResponse",function(done){
      var dbResults = {}
      rdsDecision.formatGenericResponse(null,dbResults).then(r=>{
        assert(Object.is(r,dbResults),"Wrong object returned")
        done()
      })
    })

    //SELECT * FROM discussion d ORDER BY d.updateTime DESC LIMIT NaN,100
    it("Returns a valid sql with an offset",function(){
      var input = {
        offset: 5,
        language: undefined,
        location: undefined,
      }
      var result = rdsDecision.calculateSearchDiscussionsQuery(input)
      //console.log("CASE 0"+JSON.stringify(result))
      assert(result.query,"No query generated")
      assert(result.query.includes("SELECT * FROM discussion d ORDER BY d.updateTime DESC LIMIT "+input.offset+","+settings.maxSearchResultsPerPage), "Wrong Query")
      assert(result.parameters.length ===0,"No parameters generated")
    })

    it("Returns a valid sql with no offset",function(){
      var input = {
        language: undefined,
        location: undefined,
      }
      var result = rdsDecision.calculateSearchDiscussionsQuery(input)
      //console.log("CASE 0"+JSON.stringify(result))
      assert(result.query,"No query generated")
      assert(result.query.includes("SELECT * FROM discussion d ORDER BY d.updateTime DESC LIMIT 0,"+settings.maxSearchResultsPerPage), "Wrong Query")
      assert(result.parameters.length ===0,"No parameters generated")
    })

    it("Returns a valid sql with no topic, language, or location set",function(){
      var input = {
        offset: 0,
        language: undefined,
        location: undefined,
      }
      var result = rdsDecision.calculateSearchDiscussionsQuery(input)
      //console.log("CASE 0"+JSON.stringify(result))
      assert(result.query,"No query generated")
      assert(result.query.includes("SELECT * FROM discussion d"), "Wrong Query")
      assert(result.parameters.length ===0,"No parameters generated")
    })

    it("Returns a valid sql with no topic but language and location set",function(){
      var input = {
        offset: 0,
        language: "French",
        location: "France",
      }
      var result = rdsDecision.calculateSearchDiscussionsQuery(input)
      //console.log(result.query)
      assert(result.query,"No query generated")
      assert(result.query.includes("SELECT * FROM discussion d WHERE (d.location = ? OR d.location = 'International') AND d.language = ?"),"Wrong Query")
      assert(result.parameters.length ===2,"No parameters generated")
      //console.log(JSON.stringify(result))
    })

    it("Returns a valid sql with topic but no language or location set",function(){
      var input = {
        offset: 0,
        topic: "news"
      }
      var result = rdsDecision.calculateSearchDiscussionsQuery(input)
      //console.log(result.query)
      assert(result.query,"No query generated")
      assert(result.query.includes("SELECT * FROM discussion d JOIN topic t ON d.discussionId = t.discussionId WHERE t.name = ?"),"Wrong Query")
      assert(result.parameters.length ===1,"No parameters generated")
      //console.log(JSON.stringify(result))
    })

    it("Returns a valid sql with topic,language and location",function(){
      var input = {
        offset: 0,
        topic: "news",
        location:"France",
        language:"French"
      }
      var result = rdsDecision.calculateSearchDiscussionsQuery(input)
      //console.log(result.query)
      assert(result.query,"No query generated")
      assert(result.query.includes("SELECT * FROM discussion d JOIN topic t ON d.discussionId = t.discussionId WHERE (d.location = ? OR d.location = 'International') AND d.language = ? AND t.name = ?"),"Wrong Query")
      assert(result.parameters.length ===3,"No parameters generated")
      //console.log(JSON.stringify(result))
    })

    //LIMIT "+input.offset+","+settings.maxSearchResultsPerPage
    it("returns a valid sql with offset for searchTopicsQuery",function(){
      var input = {
        offset: 10,
        location:"France",
        language:"French"
      }
      var result = rdsDecision.calculateSearchTopicsQuery(input)
      //console.log(result.query)
      assert(result.query,"No query generated")
      //                            SELECT *, COUNT(t.discussionId) AS children, MAX(t.updateTime) AS max_time FROM topic t WHERE (t.location = ? OR t.location = 'International') AND t.language = ? OR t.location = 'International' GROUP BY t.name ORDER BY max_time DESC LIMIT 10,100
      assert(result.query.includes("SELECT *, COUNT(t.discussionId) AS children, MAX(t.updateTime) AS max_time FROM topic t WHERE (t.location = ? OR t.location = 'International') AND t.language = ? GROUP BY t.name ORDER BY max_time DESC LIMIT "+input.offset+","+settings.maxSearchResultsPerPage),"Wrong Query")
      assert(result.parameters.length === 2 ,"No parameters generated")
      //console.log(JSON.stringify(result))
    })

    it("returns a valid sql with no offset searchTopicsQuery",function(){
      var input = {
        location:"France",
        language:"French"
      }
      var result = rdsDecision.calculateSearchTopicsQuery(input)
      assert(result.query,"No query generated")
      assert(result.query.includes("SELECT *, COUNT(t.discussionId) AS children, MAX(t.updateTime) AS max_time FROM topic t WHERE (t.location = ? OR t.location = 'International') AND t.language = ? GROUP BY t.name ORDER BY max_time DESC LIMIT 0,"+settings.maxSearchResultsPerPage),"Wrong Query")
      assert(result.parameters.length === 2 ,"No parameters generated")
      //console.log(JSON.stringify(result))
    })

    it("returns a valid sql with language and location set",function(){
      var input = {
        offset: 0,
        location:"France",
        language:"French"
      }
      var result = rdsDecision.calculateSearchTopicsQuery(input)
      //console.log(result.query)
      assert(result.query,"No query generated")
                                  //SELECT *, COUNT(t.discussionId) AS children, MAX(t.updateTime) AS max_time FROM topic t WHERE (t.location = ? OR t.location = 'International') AND t.language = ? GROUP BY t.name ORDER BY max_time DESC LIMIT 0,100
      assert(result.query.includes("SELECT *, COUNT(t.discussionId) AS children, MAX(t.updateTime) AS max_time FROM topic t WHERE (t.location = ? OR t.location = 'International') AND t.language = ? GROUP BY t.name ORDER BY max_time"),"Wrong Query")
      assert(result.parameters.length === 2 ,"No parameters generated")
      //console.log(JSON.stringify(result))
    })

    it("returns a valid sql with language when location not present",function(){
      var input = {
        offset: 0,
        language:"French"
      }
      var result = rdsDecision.calculateSearchTopicsQuery(input)
      //console.log("CASE 3"+JSON.stringify(result))
      console.log(result.query)
      assert(result.query,"No query generated")
                                  //SELECT *, COUNT(t.discussionId) AS children, MAX(t.updateTime) AS max_time FROM topic t WHERE t.language = ? GROUP BY t.name ORDER BY max_time DESC LIMIT 0,100
      assert(result.query.includes("SELECT *, COUNT(t.discussionId) AS children, MAX(t.updateTime) AS max_time FROM topic t WHERE t.language = ? GROUP BY t.name ORDER BY max_time"),"Wrong Query")
      assert(result.parameters.length ===1 ,"No parameters generated")
      //console.log(JSON.stringify(result))
    })

    it("returns a valid sql with location when language is not present",function(){
      var input = {
        offset: 0,
        location:"France"
      }
      var result = rdsDecision.calculateSearchTopicsQuery(input)
      //console.log("CASE 3"+JSON.stringify(result))
      //console.log(result.query)
      assert(result.query,"No query generated")
      assert(result.query.includes("SELECT *, COUNT(t.discussionId) AS children, MAX(t.updateTime) AS max_time FROM topic t WHERE (t.location = ? OR t.location = 'International') GROUP BY t.name ORDER BY max_time"),"Wrong Query")
      assert(result.parameters.length === 1 ,"No parameters generated")
      //console.log(JSON.stringify(result))
    })

    it("returns valid queries from dataSet",function(){
      var dataSets = [
        {
          table: "discussion",
          data: {
            key:"sfsf",
            discussionId: "WWE",
            discussionTitle:"some title",
            userId: "some_userId",
            location:"France",
            language:"French"//,
            //updateTime: new Date().getTime()
          }
        },
        {
          table: "topic",
          data: {
            discussionId: "WWE",
            name:"dancing",
            location:"France",
            language:"French"//,
            //updateTime: new Date().getTime()
          }
        }
      ]
      var result = rdsDecision.createQuerySetsFromDataSets(dataSets)
      assert(result[2].query.includes("INSERT INTO topic SET `discussionId` = ?, `name` = ?, `location` = ?, `language` = ?, `updateTime` = UNIX_TIMESTAMP()"),"Wrong Query a ")
      assert(result[1].query.includes("UPDATE topic t SET t.`updateTime` = UNIX_TIMESTAMP() WHERE t.`name` = ?"),"Wrong Query b")
      assert(result[0].query.includes("INSERT INTO discussion SET `key` = ?, `discussionId` = ?, `discussionTitle` = ?, `userId` = ?, `location` = ?, `language` = ?, `updateTime` = UNIX_TIMESTAMP()"),"Wrong Query c")
      //console.log(JSON.stringify(result))
      assert(result,"No query set created")
    })

})
