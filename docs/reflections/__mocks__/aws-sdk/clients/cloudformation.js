var errorMode = undefined;

var Mock = {}
Mock.describeStacks = function(params,callback){
  var response = {
        Stacks: [{
          Outputs:[]
        }]
  }
  callback(errorMode,response)
}

module.exports = function(){
  return Mock
}
