
const express          = require('express')
const router           = express.Router()
const userService      = require('../services/user.services.js')
const webWriterService = require("../services/web.writer.services.js")

//Verify the requestor for these subsequent methods is using the mobile app
//router.use(securityService.isMobileAppUser)

router.post('/mobile-passive-create', function (req, res) {
  webWriterService.send(userService.createMobilePassiveUser(req),res)
})

module.exports = router
