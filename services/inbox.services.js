const utilities    = require('../shared/utilities')
const settings     = require("../settings.json")
const rdsService   = require('../services/rds.services')

module.exports.sendNewCommentNotifications = function(userId,discussionId) {
  var query  ="INSERT INTO inbox (userId,discussionId,updateTime) SELECT userId,discussionId, UNIX_TIMESTAMP() FROM discussion_inbox_subscriptions WHERE discussionId = ? AND userId != ?"
  var values = [discussionId,userId]
  return rdsService.preparedStatement(query,values)
}

module.exports.subscribeToDiscussion = function(userId,discussionId) {
  var query  ="REPLACE INTO discussion_inbox_subscriptions (userId,discussionId) VALUES (?,?)"
  var values = [userId,discussionId]
  return rdsService.preparedStatement(query,values)
}

module.exports.count = function(userId) {
  var query  ="SELECT COUNT(*) AS count FROM inbox i WHERE i.userId = ?"
  var values = [userId]
  return rdsService.preparedStatement(query,values).then(result => {
     return result[0]
   })
}

module.exports.get = function(userId) {
  var query  ="SELECT discussionId,COUNT(*) AS count FROM inbox i WHERE i.userId = ? GROUP BY i.discussionId"
  var values = [userId]
  return rdsService.preparedStatement(query,values)
}

module.exports.delete = function(userId,discussionId) {
  var query  ="DELETE FROM inbox WHERE userId = ? AND discussionId = ?"
  var values = [userId,discussionId]
  return rdsService.preparedStatement(query,values)
}

module.exports.unsubscribe = function(userId,discussionId) {
  var query  ="DELETE FROM discussion_inbox_subscriptions WHERE userId = ? AND discussionId = ?"
  var values = [userId,discussionId]
  return rdsService.preparedStatement(query,values)
}
