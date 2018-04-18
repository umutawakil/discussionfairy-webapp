const sharedUtility   = require('../shared/utilities.js')
const security        = require('../services/security.services.js')
const logger          = require('../shared/logger.js')
const settings        = require("../settings.json")

// TODO:data.pages = this.getNextAndPreviousPageNumber(req.query.p,results)
//data.p     = req.query.p

module.exports.getNextAndPreviousPageNumber = function(input,elementsFound) {
    var result = {}

    if(sharedUtility.isNumber(input)) {
        var pageNumber = parseInt(input,10)

        if(elementsFound){
          result.nextPage = pageNumber + 1
          result.currentPage = pageNumber
        }
        if(pageNumber>0){
          result.previousPage = pageNumber - 1
          result.currentPage = pageNumber
        }

    } else {
        if(elementsFound){
          result.nextPage = 1
          result.currentPage = 0
        }
    }
    return result
}

//TODO: Needs more testing
module.exports.calculateOffsetFromInput = function(input) {
  if(input.p) {
    input.offset = settings.maxSearchResultsPerPage * input.p
  } else {
    input.offset = 0
  }
  return input;
}

var mobileAgents = ["Mobi","mobi","Android","iPhone","iPad","phone","Phone","Tablet","tablet"]
module.exports.mobileAgents = mobileAgents
function isMobileUserAgent(userAgent){
  for(var i=0; i < mobileAgents.length; i++){
    if(userAgent.includes(mobileAgents[i])){
      return true
    }
  }
  return false
}

module.exports.isMobileRequest = function(req){
  var header = req.headers["user-agent"]
  return isMobileUserAgent(header)
}
