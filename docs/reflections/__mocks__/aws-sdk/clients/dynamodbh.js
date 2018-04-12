
var errorMode = undefined;

var Mock = {}
Mock.query = function(params,callback){
  var response = {
      Items: []
  }
  callback(errorMode,response)
}

Mock.getItem = function(params,callback){
  var response = {
      Item:{
        data: "xxxxxxx"
      }
  }
  callback(errorMode,response)
}
Mock.putItem = function(params,callback){
  var response = {
      data: "xxxxxxx"
  }
  callback(errorMode,response)
}
Mock.deleteItem = function(params,callback){
  var response = {
      data: "xxxxxxx"
  }
  callback(errorMode,response)
}

module.exports = function(){
  return Mock
}

var Converter = {}
Converter.marshall = function(x){
  return x
}
Converter.unmarshall = function(x){
  return x
}

module.exports.Converter = Converter
