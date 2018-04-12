
var rdsService          = require("../services/rds.services.js")
var rdsDecision         = require("../decisions/rds.decisions.js")
var discussionDecision  = require("../decisions/discussion.decisions.js")
var settings            = require("../settings.json")

module.exports.setRDSService = function(x){
  rdsService = x
}
module.exports.getRDSService = function(){
  return rdsService
}

module.exports.getDiscussion = function(discussionId) {
  var query = "SELECT * FROM discussion d WHERE d.discussionId = ? "
  var parameters = [discussionId]

  return rdsService.preparedStatement(query,parameters).then(results => {
    return results?results[0]:results
  })
}

module.exports.searchDiscussions = function(input) {
  var querySet = rdsDecision.calculateSearchDiscussionsQuery(input)
  return rdsService.preparedStatement(querySet.query,querySet.parameters)
}

/*function searchDiscussionsWithoutTopic(input){
  var query="SELECT * FROM discussions d WHERE d.location=? AND d.language=? LIMIT "+input.offset+", "+settings.maxSearchResultsPerPage+" ORDER BY d.updateTime DESC"
  var parameters = [input.location,input.language,input.offset]

  return rdsService.preparedStatement(query,parameters)
}
function searchDiscussionsWithTopic(input){
  var query = "SELECT * FROM discussions d JOIN topics t ON d.discussionId = t.discussionId WHERE d.location=? AND d.language=? AND t.name=? LIMIT "+input.offset+", "+settings.maxSearchResultsPerPage+" ORDER BY d.updateTime DESC"
  var parameters = [input.location,input.language,input.topic,input.offset]
  return rdsService.preparedStatement(query,parameters)
}*/

//TODO: What is the default language and location? Should users be forced to pick a language and location?
//TODO: How does this differ from language settings?

module.exports.searchTopics = function(input) {
  var querySet = rdsDecision.calculateSearchTopicsQuery(input)
  return rdsService.preparedStatement(querySet.query,querySet.parameters)
}


module.exports.getLanguagesInLocation = function(input) {
  var query = "SELECT DISTINCT d.language FROM discussion d WHERE d.location=? ORDER BY d.language ASC"
  var parameters = [input.location]
  return rdsService.preparedStatement(query,parameters)
}

module.exports.getAllLocations = function() {
  var query = "SELECT DISTINCT d.location FROM discussion d ORDER BY d.location ASC"
  var parameters = []
  return rdsService.preparedStatement(query,parameters)
}

module.exports.getAllLanguages = function() {
  var query = "SELECT DISTINCT d.location FROM discussion d ORDER BY d.language ASC"
  var parameters = []
  return rdsService.preparedStatement(query,parameters)
}

module.exports.propagateVote = function(userId,discussionId) {
  var query1 = "UPDATE discussion d SET d.popularity = d.popularity + 1, d.likes = d.likes + 1, d.updateTime = UNIX_TIMESTAMP() WHERE d.discussionId = ? "
  var parameters = [discussionId]
  var p1 = rdsService.preparedStatement(query1,parameters)

  var query2 = "UPDATE topic t SET t.updateTime = UNIX_TIMESTAMP() WHERE t.discussionId = ? "
  var p2 = rdsService.preparedStatement(query2,parameters)

  return Promise.all([p1,p2])
}

module.exports.updateFromComment = function(discussionId) {
  var query1 = "UPDATE discussion d SET d.updateTime = UNIX_TIMESTAMP(), d.comments = d.comments + 1 WHERE d.discussionId = ? "
  var parameters = [discussionId]
  var p1 = rdsService.preparedStatement(query1,parameters)

  var query2 = "UPDATE topic t SET t.updateTime = UNIX_TIMESTAMP() WHERE t.discussionId = ? "
  var p2 = rdsService.preparedStatement(query2,parameters)

  return Promise.all([p1,p2])
}

module.exports.updateWithNewDiscussion = function(d) {
  return rdsService.storeDataSets(discussionDecision.convertDiscussionToStorageSets(d))
}
