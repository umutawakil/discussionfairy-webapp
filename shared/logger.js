
var disable = false

module.exports.disable = function(){
  disable = true
}

module.exports.enable = function(){
  disable = false
}

module.exports.log = function(err) {
  if(disable){
    return
  }
  console.log(err,err.stack)
}

module.exports.logX = function(devMessage,err) {
  if(disable){
    return
  }

  //TODO: I don't get the error syntax below for log(err,err.stack)
  console.log("Custom Logger: "+devMessage)
  //console.log("Logger Error Message"+err, err.stack)
  //console.log("Error Message: "+err.message)
  if(err) {
    console.log("Custom Logger: "+err,err.stack)
  }
}

module.exports.disable = function(){
  disable = true
}
