const sharedUtility   = require('../shared/utilities.js')
const security        = require('../services/security.services.js')
const logger          = require('../shared/logger.js')
const settings        = require("../settings.json")

/*module.exports.handleRequest = function (requestFunc,successFunc, req, res) {
    var promise = new Promise(function(resolve,reject){
      var requestResult
      try {
        requestResult = requestFunc()
      } catch(exception) {
        logger.logX("Exception thrown in request function: ",exception)
        res.status(500);
        res.send(exception.stack)
        reject(exception)
        return
      }

      requestResult.then(function(successInput){
        try{
            successFunc(successInput)
            resolve()
        }catch(exception){
          logger.logX("Exception thrown in success function: ",exception)
          res.status(500);
          res.send(exception.stack)
          resolve(exception)
          return
        }

      }).catch((rejection)=>{
        if(rejection instanceof Error) {
          //Most likely thrown by the requestResult
          logger.logX("Exception thrown in promise/callback logic: ",rejection)
          res.status(500);
          res.send(rejection.stack)
          resolve(rejection)

        } else if(rejection.hasOwnProperty('isNonUserError') && (!rejection.isNonUserError)){
          security.log(req,rejection.result.message)
          res.status(400)
          res.send("BAD REQUEST")
          resolve(rejection)

        } else if(rejection.hasOwnProperty('isNonUserError') && rejection.error){
          logger.log(rejection.error)
          res.status(500);
          res.send(rejection.error.stack)
          resolve(rejection)
        } else {
          console.log("Unknown Error Case:"+JSON.stringify(rejection))
          logger.log(JSON.stringify(rejection))
          res.status(500);
          res.send("Error")
          reject(rejection)
        }
      })

    })
    return promise
}*/

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

/*module.exports.createResultsRequestFunction = function(req,res,callback) {
  return ()=> {
     var info = req.query
     if(!info.hasOwnProperty('p')) {
       info.offset   = 0

     } else {
       info.offset = parseInt(info.p)*(settings.maxSearchResultsPerPage)
     }
     return callback(info)
  }
}*/

/*module.exports.createResultsSuccessFunction = function(data,req,res,desktop,mobile) {
  return (results)=> {
      data.results         = results
      //data.locations       = results.locations
      //data.languages       = results.languages
      data.languageEncoded = convertUndefinedToBlank(encodeURIComponent(req.query.language))
      data.language        = req.query.language
      data.locationEncoded = convertUndefinedToBlank(encodeURIComponent(req.query.location))
      data.location        = req.query.location
      if(req.query.topic) {
        data.topicEncoded  = convertUndefinedToBlank(encodeURIComponent(req.query.topic))
        data.topic         = req.query.topic
      }
      //var elementsFound = data.results.length !==0 //data.new.length !== 0 && data.hot.length !== 0
      //data.pages = this.getNextAndPreviousPageNumber(req.query.p,elementsFound)
      //data.p     = req.query.p

      data.pages = this.getNextAndPreviousPageNumber(req.query.p,results)
      data.p     = req.query.p

      //res.locals.isMobile = true
      //data.isMobile = true
      if(data.isMobile){
          res.render(mobile,data)
      } else {
        res.render(desktop,data)
      }
    }
}

module.exports.createStandardAPIRequestFunction = function(req,res,callback) {
  return ()=> {
     var info = req.query
     if(!info.hasOwnProperty('offset')) {
       info.offset   = 0

     } else {
       info.offset = parseInt(info.p)*(settings.maxSearchResultsPerPage)
     }
     return callback(info)
  }
}

module.exports.standardJSONSuccessFunction = function(req,res) {
  return (results)=> {
        res.json(results)
    }
}

function convertUndefinedToBlank(x){
  if(x==="undefined"){
    return ""
  } else {
    return x
  }
}*/
