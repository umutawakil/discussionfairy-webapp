
var error = undefined
var fields = {}
var results = {}

//TODO: Create provisioning scripts
module.exports.query = function(sql,callback){
  callback(error,results,fields)
}

module.exports.rollback = function(callback){
  callback()
}

module.exports.beginTransaction = function(callback){
  callback()
}

module.exports.commit = function(callback){
  callback(error)
}
