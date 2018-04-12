const sharedUtility   = require("../shared/utilities")

module.exports.createKey = function(info){
  return info.discussionId+"-"+sharedUtility.generateUUID()+"-"+(new Date().getTime()).toString()+"."+info.extension
}
