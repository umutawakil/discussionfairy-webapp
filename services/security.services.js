//var GLOBAL_MOBILE_APP_KEY       = "c9fe6e48dc46e83790c9be4ed5aa025e"
//var CryptoJS = require("crypto-js");

//var last = {message:"",error:""}
//var disable = false;

//TODO: Validate the requestId? How? Captcha?
/* Down the road this might require SNS or email verification but to start
 It will be a hardcoded private key on the ios side matching the server. This blocks anyone that hasn't decompiled
 the source code. Good enough for now. If a bad validation occurs block/mark the IP address indefinitely and send out a notification. Log each attempt
 at that IP. Stubs for that code could be created here so as not to lose too much momentum.
 */

/*module.exports.disable = function() {
  disable = true
}*/

/*module.exports.log = function(req,message,error) {
  if(disable){
    return
  }

  //TODO: An CloudWatch/SNS notification and DB write would make sense here
  console.log("Security: "+message)
  if(error) {
      console.log("Security: "+error)
  }

  last.message = message
  last.error = error
}*/

//module.exports.last = last
