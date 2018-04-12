const express          = require('express')
const router           = express.Router()
const ResponseData     = require("../shared/response-data.js")
const searchService    = require("../services/search.services.js")
const webWriterService = require("../services/web.writer.services.js")
const routeUtility     = require("../utilities/route.utilities")

router.get('/',function(req,res){

  var input = routeUtility.calculateOffsetFromInput(req.query)
  searchService.searchTopics(input).then(topics => {
    var data                     = new ResponseData.StandardViewResult(req,res)
    data.results                 = topics
    data.results.pages           = routeUtility.getNextAndPreviousPageNumber(input.p,topics)
    data.results.languageEncoded = encodeURIComponent(input.language);
    data.results.locationEncoded = encodeURIComponent(input.location);
    data.results.location        = input.location
    data.results.language        = input.language
    //data.results.locations       = searchService.getAllLocations();
    //data.results.languages       = searchService.getAllLanguages();

    if(res.locals.isMobile){
      res.render('topics/browse-topics-mobile.html',data)
    } else {
      res.render('topics/browse-topics.html',data)
    }

  }).catch(e => {
    webWriterService.sendErrorResponse(e,res)
  })

})

router.get('/api',function(req,res){
  webWriterService.json(searchService.searchTopics(req.query),res)
})

module.exports = router
