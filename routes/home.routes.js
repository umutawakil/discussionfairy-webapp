const express           = require('express')
const router            = express.Router()
const ResponseData      = require("../shared/response-data.js")
const searchService     = require("../services/search.services.js")
const webWriterService  = require("../services/web.writer.services")
const routeUtility      = require("../utilities/route.utilities")
//const systemService     = require('../services/system.services')

router.get('/',function(req,res,next){
  //systemService.coldStartCheck().then(() => {
    handleRequest(req,res,next)
  //})
})
router.get('/home',function(req,res,next){
  //systemService.coldStartCheck().then(() => {
    handleRequest(req,res,next)
  //})
})

function handleRequest(req,res,next){
  if(req.query.discussionId) {
    console.log("View Discussion htting home page route")
    next()
    return
  }

  var input = routeUtility.calculateOffsetFromInput(req.query)

  searchService.searchDiscussions(input).then(discussions => {
    var data                     = new ResponseData.StandardViewResult(req,res)
    data.results                 = discussions
    data.results.pages           = routeUtility.getNextAndPreviousPageNumber(input.p,discussions)
    data.results.languageEncoded = encodeURIComponent(input.language);
    data.results.language        = input.language
    data.results.locationEncoded = encodeURIComponent(input.location);
    data.results.location        = input.location
    data.results.topicEncoded    = encodeURIComponent(input.topic);
    data.results.topic           = input.topic
    //data.results.locations       = searchService.getAllLocations();
    //data.results.languages       = searchService.getAllLanguages();

    if(res.locals.isMobile){
      res.render('browse/index-mobile.html',data)
    } else {

      res.render('browse/index.html',data)
    }

  }).catch(e => {
    webWriterService.sendErrorResponse(e,res)
  })
}

module.exports = router

//const languageParser    = require('accept-language-parser');
//const languageInfo      = require('languages')
//const cookieParser      = require('cookie')

/*router.use(function(req, res, next){

  //TODO: 1st check cookie for saved language preference and saved location preference
  var cookies = cookieParser.parse(req.headers.cookie || '');
  if(cookies){
    cookies = JSON.parse(cookies)
  }
  console.log("COOKIES: "+JSON.stringify(cookies))
  var dataLanguageCookie = cookies.dataLanguage
  if(dataLanguageCookie !== undefined) {
      if(!req.query.language){
        req.query.language = dataLanguageCookie
        console.log("DATA_LANG: "+JSON.stringify(dataLanguageCookie))
      }

      if(!req.query.location){
        var dataLocationCookie = cookies.dataLocation
        if(dataLocationCookie) {
          req.query.location = dataLocationCookie
        }
      }

      next()
      return
  }
  if(!req.query.location){
    var dataLocationCookie = cookies.dataLocation
    if(dataLocationCookie) {
      req.query.location = dataLocationCookie
      console.log("DATA_LOCATION: "+dataLocationCookie)
    }
  }

  //TODO: No language found so attempt to use the accept-language if it matches an existing language
  var languageHeader = req.headers['accept-language']
  if(!languageHeader){
    next()
  }
  var languages = languageParser.parse(languageHeader);
  if(languages.length === 0){
    next()
  }

  var prefLanguageCode
  languages.forEach(function(l){
    if(l.quality===1){
      prefLanguageCode = l.code
    }
  })
  var preferredLanguage = languageInfo.getLanguageInfo(prefLanguageCode).name

  //console.log("PrefLangCode: "+prefLanguageCode)
  //console.log(languages)

  //TODO: Does this language exist in our set? If yes that that to language else leave language false
  var requestFunction = function(){
    return searchService.isLanguagePresent(preferredLanguage)
  }
  var successFunction = function(result) {
    if(result){
      req.query.language = preferredLanguage
    }
    next()
  }
  routeUtility.handleRequest(requestFunction,successFunction,req,res)
})*/

/*var responseCookie
if(data.language && (data.newDiscussions.length >0 && data.hotDiscussions.length > 0)) {
  //res.cookie("dataLanguage", data.language, {httpOnly: true,maxAge : 1000*3600});
  responseCookie.dataLanguage = data.language
}
if(data.location && (data.newDiscussions.length >0 && data.hotDiscussions.length > 0)) {
  //res.cookie("dataLocation", data.location, {httpOnly: true,maxAge : 1000*3600});
  responseCookie.dataLocation = data.location
}
if(data.location || data.language) {
  res.setHeader('Set-Cookie', cookieParser.serialize('data', JSON.stringify(responseCookie), {
    httpOnly: true,
    maxAge: 3600*24*7*4, // In seconds
    expires: new Date(new Date().getTime()+ 1000*3600*24*7*4) // In milliseconds
  }));
}*/
