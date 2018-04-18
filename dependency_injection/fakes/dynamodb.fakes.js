
module.exports.putItem = function(params,callback) {
  callback(false,{})
  return Promise.resolve({})
}

module.exports.getItem = function(params,callback){
  callback(false,{Item:{}})
  return Promise.resolve({Item:{}})
}

module.exports.deleteItem = function(params,callback){
  callback(false,{})
  return Promise.resolve({})
}

module.exports.query = function(params, callback) {
  callback(false,{})
  return Promise.resolve({})
}
