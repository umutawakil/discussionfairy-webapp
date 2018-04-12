const express          = require('express')
const router           = express.Router()
const pushService      = require("../services/push.services.js")
const userService      = require("../services/user.services.js")
const webWriterService = require("../services/web.writer.services.js")
module.exports         = router

router.use(userService.isAuthenticatedAppUser)

router.post('/apns/register',function(req,res){
    console.log("APNS REGISTER: "+req.userId)
    var result = pushService.apnsRegister(req.userId,req.body.deviceToken)
                 webWriterService.json(result,res)

})
router.post('/gcm/register',function(req,res){
    console.log("GCM REGISTER: "+req.userId)
    var result = pushService.gcmRegister(req.userId,req.body.deviceToken)
                 webWriterService.json(result,res)
})
