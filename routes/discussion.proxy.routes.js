
const express            = require('express')
const router             = express.Router()
const discussionService  = require("../services/discussion.services")
const commentService     = require("../services/comment.services")
const ResponseData       = require("../shared/response-data")
const webWriterService   = require("../services/web.writer.services")
const discussionDecision = require("../decisions/discussion.decisions")
//const systemService      = require("../services/system.services")

module.exports = router

router.use('/:discussionId', function(req, res,next) {
  var input= req.params
  if(!input.discussionId) {
    next()
    return
  }

  //systemService.coldStartCheck().then(() => {
    discussionService.get(input.discussionId).then(d=>{
      if(d){
        showDiscussion(d,req,res)
      } else {
        next()
      }

    }).catch(e => {
      webWriterService.sendErrorResponse(e,res)
    })
  //})

})

function showDiscussion(d,req,res) {
  commentService.getComments(req.params.discussionId).then( c =>{
    return {comments:c,discussion:d}

  }).then(output=>{
    var data = new ResponseData.StandardViewResult(req,res)
    data.discussion = output.discussion
    data.ks1 = discussionDecision.createKeywordsStringWithAnd(output.discussion)
    data.ks2 = discussionDecision.createKeywordsStringWithoutAnd(output.discussion)
    data.date = discussionDecision.createDate(output.discussion)
    data.lastmod = discussionDecision.createLastMod(output.discussion)
    data.comments = output.comments
    res.setHeader("date",data.date)
    res.setHeader("last-modified",data.lastmod)

    if(res.locals.isMobile){
      res.app = req.app
      res.render('discussion/view-discussion-mobile.html',data)
      //res.render(process.env.BASE_DIR+'/discussion/view-discussion-mobile.html',data)
    } else {
      res.app = req.app
      //njk.render(process.env.BASE_DIR+'/views/discussion/view-discussion.html',data)
      res.render('discussion/view-discussion.html',data)
    }

  }).catch(e => {
    webWriterService.sendErrorResponse(e,res)
  })
}
