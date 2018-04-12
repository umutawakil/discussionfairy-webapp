
const logger = require('../shared/logger.js')

module.exports.json = function(input,res){
  return sendResponse(input,res,"json")
}

module.exports.send = function(input,res){
  return sendResponse(input,res,"send")
}

function consolidateMessage(x){
  if(x instanceof Error){
    return x.stack
  }
  if(x.message && x.error && x.error.stack){
    return x.message+" "+x.error.stack
  }
  if(x.message){
    return x.message
  }
  if(x.error && x.error.stack){
    return x.error.stack
  }
  return JSON.stringify(x)
}

module.exports.sendErrorResponse = sendErrorResponse
function sendErrorResponse(e,res){
  res.status(e.code?e.code:500)
  var response = consolidateMessage(e)
  res.send(response)
  console.log(response)
  return response
}

function sendResponse(input,res,type){
  var promise = new Promise((resolve)=>{
    var errorPromise = input.catch(e=>{
      console.log("WEB Writer Error: "+JSON.stringify(e))
      if(!process.env.testing){
        logger.log(e)
      }
      //res.status(e.code?e.code:500)
      //var response = consolidateMessage(e)
      //res.send(response)
      resolve(sendErrorResponse(e,res))
    })

    var successPromise = input.then(r => {
      console.log("WEB Writer SEND_RESPONSE Result: "+JSON.stringify(r))
      if(type === "send") {
        res.contentType = "text/plain"
      }
      res[type](r)
      resolve(r)
    })
  })
  return promise
}
