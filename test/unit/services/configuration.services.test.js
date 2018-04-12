const assert                = require('chai').assert
const configurationService  = require("../../../services/configuration.services.js")

var cloudformation          = configurationService.getCloudformation()

afterEach(function(){
  configurationService.setCloudformation(cloudformation)
})

describe("Configuration Service:",function(){
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

  it("retrieves external configurations",function(done){
    var mock = createMock("describeStacks",undefined,result)
    configurationService.setCloudformation(mock)

    configurationService.retrieveExternalConfigurations().then(r=>{
      done()
    }).catch(e=>{
      console.log(e)
      done(e)
    })
  })
})

function createMock(functionName,error,response){
  var mock = {}
  mock[functionName] = function(params,callback){
    callback(error,response)
  }
  return mock
}
