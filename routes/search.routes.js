const express                 = require('express')
const router                  = express.Router()
const ResponseData            = require("../shared/response-data.js")
const searchService           = require("../services/search.services.js")
const webWriterService        = require("../services/web.writer.services.js")

router.get('/', function (req, res) {

    var data = new ResponseData.StandardViewResult(req,res)
    res.render('search/search.html',data)
})

router.get('/discussion/browse/api', function (req, res) {
  var input  = req.query
  var result = searchService.searchDiscussions(input)
               webWriterService.json(result,res)
})

module.exports = router
