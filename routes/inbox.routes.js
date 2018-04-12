const express           = require('express')
const router            = express.Router()
const inboxService      = require("../services/inbox.services")
const pushService       = require("../services/push.services")
const userService       = require("../services/user.services")
const webWriterService  = require('../services/web.writer.services')

module.exports          = router

router.use(userService.isAuthenticatedAppUser)

router.get('/',function(req,res){
    var userId = req.userId
    var result = inboxService.get(userId)
    webWriterService.json(result, res)
})

router.post('/delete',function(req,res){
    var userId       = req.userId
    var discussionId = req.body.discussionId
    var result       = inboxService.delete(userId,discussionId)
    webWriterService.json(result, res)
})

router.get('/count',function(req,res){
    var userId = req.userId
    var result = inboxService.count(userId)
    webWriterService.json(result, res)
})

//TODO: Needs unit tests
router.post('/subscribe',function(req,res){
    var userId       = req.userId
    var discussionId = req.body.discussionId

    var result = inboxService.subscribeToDiscussion(userId,discussionId).then(() => {
      return pushService.subscribeToDiscussion(userId,discussionId)
    })
    webWriterService.json(result, res)
})

//TODO: Needs unit tests
router.post('/unsubscribe',function(req,res){
    var userId       = req.userId
    var discussionId = req.body.discussionId

    var result = inboxService.unsubscribe(userId,discussionId).then(() => {
      return pushService.unsubscribe(userId,discussionId)
    })
    webWriterService.json(result, res)
})
