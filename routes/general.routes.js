const express           = require('express')
const router            = express.Router()
const ResponseData      = require("../shared/response-data.js")

router.get('/record', function (req, res) {
  var data = new ResponseData.StandardViewResult(req,res)

  res.render('general/record.html',data)
})

router.get('/how-it-works', function (req, res) {
  var data = new ResponseData.StandardViewResult(req,res)
  res.render('general/how-it-works.html',data)
})

router.get('/feedback', function (req, res) {
  var data = new ResponseData.StandardViewResult(req,res)

  res.render('general/feedback.html',data)
})

/*router.get('/about', function (req, res) {
  var data = new ResponseData.StandardViewResult(req,res)

  res.render('general/about.html',data)
})*/

router.get('/contact', function (req, res) {
  var data = new ResponseData.StandardViewResult(req,res)

  res.render('general/contact.html',data)
})

router.get('/privacy-terms', function (req, res) {
  var data = new ResponseData.StandardViewResult(req,res)

  res.render('general/privacy-terms.html',data)
})

module.exports = router
