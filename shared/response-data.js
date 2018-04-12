
var settings     = require("../settings.json")
var routeUtility = require("../utilities/route.utilities.js")

//module.exports = ResponseData

function StandardViewResult(req,res){
  this.isMobile                   = routeUtility.isMobileRequest(req)
  //this.locals                   = res.locals
  this.publicStaticContentURL     = process.env.PublicCDNURL
  this.recordingSourceURL         = process.env.RecordingSourceURL
  this.year                       = (new Date()).getFullYear();
  this.url                        = settings.url
  this.maxDiscussionIdLength      = settings.maxDiscussionIdLength
}
module.exports.StandardViewResult = StandardViewResult

function DiscussionListResult() {
  this.recordingSourceURL           = process.env.RecordingSourceURL
}
module.exports.DiscussionListResult = DiscussionListResult
