const settings      = require("../settings.json")

module.exports.isUserIdFormatValid = function(x){
  if(!x || x.length <= 0 || x.length > settings.maxUserIdLength){
    return false
  }
  return true
}
