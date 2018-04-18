
module.exports.describeStacks = function(params,callback){
  var result = {
    Stacks: [
      {
        Outputs:[
          {OutputKey: "s0key1",OutputValue:"s0val1"},
          {OutputKey: "s0key2",OutputValue:"s0val2"}
        ]
      },
      {
        Outputs:[
          {OutputKey: "s1key1",OutputValue:"s1val1"},
          {OutputKey: "s1key2",OutputValue:"s1val2"}
        ]
      }
    ]
  }  
  callback(false,result)
}
