var fakeConnection = require("./Connection.js")

var error = undefined

module.exports.setError = function(x){
  error=x
}

module.exports.getConnection = function(callback){
  callback(error,fakeConnection)
}
