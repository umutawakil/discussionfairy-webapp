var sql      = require("mysql")
var settings = require("../settings.json")

module.exports.formatGenericResponse = function(err,result){
    if(err){
      return Promise.reject({code:500,message:"RDS error",error:err})
    } else {
      console.log("RDS: "+JSON.stringify(result))
      return Promise.resolve(result)
    }
}

module.exports.calculateSearchDiscussionsQuery = function(input){
  var clauseSet = [
    {name: "location",value:input.location},
    {name: "language",value:input.language},
    {name: "topic", value:input.topic}
  ]

  var whereClause = ""
  var values = []
  clauseSet.forEach(function(c){
    if(c.value){
      if(values.length > 0){
        if(c.name==="topic"){
            whereClause = whereClause +" AND t.name = ?"
        }else {
          whereClause = whereClause +" AND d."+c.name+" = ?"
        }
      } else {
        if(c.name==="topic"){
          whereClause = whereClause +"t.name = ?"
        } else {
          //whereClause = whereClause +"d."+c.name+" = ?"
          if(c.name==="location") {
            whereClause = "(d.location = ? OR d.location = 'International')"
          } else {
            whereClause = whereClause +"d."+c.name+" = ?"
          }
        }
      }
      values.push(c.value)
    }
  })
  if(values.length > 0){
    whereClause = " WHERE "+whereClause
  }
  if(input.topic){
    whereClause = " JOIN topic t ON d.discussionId = t.discussionId"+whereClause
  }

  var offset = input.offset? Number(input.offset): 0

  var query="SELECT * FROM discussion d"+whereClause+" ORDER BY d.updateTime DESC LIMIT "+offset+","+settings.maxSearchResultsPerPage
  return {query:query,parameters:values}
}

module.exports.calculateSearchTopicsQuery = function(input){
  var clauseSet = [
    {name: "location",value:input.location},
    {name: "language",value:input.language}
  ]

  var whereClause = ""
  var values = []
  clauseSet.forEach(function(c){
    if(c.value){
      if(values.length > 0){
        whereClause = whereClause +" AND t."+c.name+" = ?"
      } else {
        //whereClause = whereClause +"t."+c.name+" = ?"
        if(c.name ==="location") {
          whereClause = "(t.location = ? OR t.location = 'International')"
        } else {
          whereClause = whereClause +"t."+c.name+" = ?"
        }
      }
      values.push(c.value)
    }
  })
  if(values.length > 0){
    whereClause = " WHERE "+whereClause
  }

  var offset = input.offset? Number(input.offset): 0

  var query="SELECT *, COUNT(t.discussionId) AS children, MAX(t.updateTime) AS max_time FROM topic t"+whereClause+" GROUP BY t.name ORDER BY max_time DESC LIMIT "+offset+","+settings.maxSearchResultsPerPage
  return {query:query,parameters:values}
}

module.exports.createQuerySetsFromDataSets = function(sets){
  var querySets = []
  sets.forEach(function(x){
    if(x.table==="topic"){
      querySets.push(createTopicUpdateTimeUpdateQuery(x))
    }
    querySets.push(createQueryStringForSet(x))
  })
  return querySets
}

function createQueryStringForSet(set){
  var queryString = ""
  var inserts     = []
  for (var key in set.data) {
  if (set.data.hasOwnProperty(key)) {
        queryString +=" `"+key+ "` = ?,"
        inserts.push(set.data[key])
    }
  }
  queryString = queryString.substring(0, queryString.length - 1);
  queryString = "INSERT INTO "+set.table+" SET"+queryString+", `updateTime` = UNIX_TIMESTAMP()"
  //console.log(queryString)
  return {query:queryString,values:inserts}
}

function createTopicUpdateTimeUpdateQuery(dataSet){
  var query = "UPDATE topic t SET t.`updateTime` = UNIX_TIMESTAMP() WHERE t.`name` = ?"
  var values = [dataSet.data.name]

  return {query:query,values:values}
}
