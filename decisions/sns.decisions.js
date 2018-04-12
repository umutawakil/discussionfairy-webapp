const ApplicationError = require("../types/responses/application.error.js")

module.exports.createStandardResponseCallback = function(resolve,reject){
  var callback = function(err,response){
    if(err){
      return reject(new ApplicationError("SNS error",err))
    } else {
      console.log("SNS_RESPONSE: "+JSON.stringify(response))
      return resolve(response)
    }
  }
  return callback
}
