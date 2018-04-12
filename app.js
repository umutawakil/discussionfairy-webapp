/*This is the express app which can be loaded into other scaffolding files.
For example: to run this app with HTTPS we wrap it by other functionality in index.js
and when this needs to be run in lambda another function will run it.
*/

const express                = require('express')
const app                    = express()
const settings               = require('./settings.json')
const logger                 = require('./shared/logger')
const bodyParser             = require('body-parser') //This middleware places POST/GET request parameters on the req.body object for use in routes.
const nunjucks               = require('nunjucks')
const routeUtility           = require('./utilities/route.utilities')
const ResponseData           = require("./shared/response-data")

const discussionRoute        = require('./routes/discussion.routes')
const discussionProxyRoute   = require('./routes/discussion.proxy.routes')
const commentRoute           = require('./routes/comment.routes')
const userRoute              = require('./routes/user.routes')
const homeRoute              = require('./routes/home.routes')
const searchRoute            = require('./routes/search.routes')
const topicRoute             = require('./routes/topic.routes')
const generalRoute           = require('./routes/general.routes')
const systemRoute            = require('./routes/system.routes')
const inboxRoute             = require('./routes/inbox.routes')
const pushRoute              = require('./routes/push.routes')
const systemService          = require('./services/system.services')
const configurationService   = require('./services/configuration.services')
const path                   = require("path")

process.env.BASE_DIR         = path.resolve(__dirname)

nunjucks.configure(process.env.BASE_DIR+'/views', {
  autoescape: true,
  express   : app
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

//TODO: Handling Lambda cold starts like a boss!!!! Lazy Loaaaaddiiiinggg!!!!!
app.use((req, res, next) => {
  systemService.initSystemConfiguration().then(() => {
    next()
  })
})

//TODO: I thought this was disabled by default? Is it because I'm using html pages?
app.use(function(req, res, next) {
  //console.log("Blocking Caching ON: "+req.originalUrl)
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
})

app.use(function(req,res,next){
  res.locals.isMobile = routeUtility.isMobileRequest(req)
  next();
})

app.use('/d/system',systemRoute)
app.use('/d/user',userRoute)
app.use('/d/discussion',discussionRoute)
app.use('/d/comment',commentRoute)
app.use('/d/search',searchRoute)
app.use('/d/topics',topicRoute)
app.use('/df',generalRoute)
app.use('/',homeRoute)
app.use('/d/inbox',inboxRoute)
app.use('/d/push',pushRoute)
app.use('/',discussionProxyRoute) //Keep this at the bottom so /:discussionId requests are only checked when all else fail

app.use(function(req, res){
  res.status(404)
  var data = new ResponseData.StandardViewResult(req,res)
  data.path = req.path.replace("/","")
  res.render('errors/404.html', data)
})

//systemService.initSystemConfiguration()

module.exports.app = app

/*process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('unhandledRejection', (reason, p) => {
  logger.logX('Unhandled Rejection at: Promise'+p+", "+reason+":, "+reason)
});*/

/*process.on('uncaughtException', (err,p) => {
  logger.logX("UNCAUGHT EXCEPTION: ",err)
})*/
