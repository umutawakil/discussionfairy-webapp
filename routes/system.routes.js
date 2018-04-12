
const express          = require('express')
const router           = express.Router()
const systemService    = require('../services/system.services.js')
const webWriterService = require("../services/web.writer.services.js")

router.get('/general-info',function(req,res){
  //systemService.coldStartCheck().then(() => {
    webWriterService.json(systemService.generalInfo(req.query),res)
  //})
  //webWriterService.json(systemService.generalInfo(req.query),res)
})

module.exports = router
