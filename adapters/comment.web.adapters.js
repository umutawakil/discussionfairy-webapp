
const utilities            = require("../shared/utilities")
const settings             = require("../settings.json")
const userDecisions        = require("../decisions/user.decisions")
//const BadUserInput         = require("../types/responses/bad.user.input")
const BadRequest           = require("../types/responses/bad.request")
const CommentUploadRequest = require("../types/comment/upload.form.comment.request")
const discussionUtility    = require("../utilities/discussion.utilities")

module.exports.parseCommentUploadFormRequest = function(req){
    var reject,resolve
    var promise = new Promise((x,y)=>{
      resolve=x
      reject=y
    })

    if(!req){
     reject(new BadRequest("No request to process"))
    } else if(!req.body){
       reject(new BadRequest("No input discussion form to process"))
    } else {
      var input                = req.body
      var formRequest          = new CommentUploadRequest()
      formRequest.userId       = req.userId
      formRequest.discussionId = input.discussionId
      formRequest.extension    = input.extension

      var result = formRequest.validate(CommentUploadRequest)
      if(!result.valid){
        reject(new BadRequest(result.message))
      } else {
        resolve(addServerSideContextProperties(formRequest))
      }
    }
    return promise
}
//TODO: THis should be using a clone
function addServerSideContextProperties(info){
  info.key          = discussionUtility.createKey(info)
  info.discussionId = info.discussionId.toLowerCase(),
  info.creationTime = new Date().getTime()
  info.updateTime   = new Date().getTime()
  info.timestamp    = new Date().getTime()
  return info
}
