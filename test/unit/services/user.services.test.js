const container          = require("../../../dependency_injection/container").init()
container.loadFakes()

const userService     = require("../../../services/user.services")
//const sinon           = require("sinon")
const assert          = require("chai").assert
//const dynamoDBService = require("../../../services/dynamodb.services")

var req = {
  headers: {
    "authentication":"Bearer XXXXXXXXXX",
    "user-agent":"a mobile browser"
  },
  connection: {
    remoteAddress:"127.0.0.1"
  },
  locals:{}
}

describe("User Service:",function(){

  /*var dynamoDBServiceStub;
  beforeEach(function(){
    dynamoDBServiceStub = sinon.stub(dynamoDBService,"simpleObjectSave");
    dynamoDBServiceStub.callsFake(()=>{
     return Promise.resolve({})
   })
  })
  afterEach(function(){
    dynamoDBServiceStub.restore()
  })*/

  it("create a mobile passive user ",function(done){
    userService.createMobilePassiveUser(req).then(r=>{
      assert(r,"No user data returned")
      done()
    }).catch(e=>{
      console.log(e)
      done(e)
    })
  })

    //TODO: user verification is needed
  it("can detect mobile authenticated app user ",function(){
    var result
    var res = {
      status:function(x){result=x},
      send:function(){},
      locals:{}
    }
    var next = function(){}
    userService.isAuthenticatedAppUser(req, res, next)
    assert(result != 400, "User incorrectly blocked")
  })

  it("can detect mobile unauthenticated app user ",function(){
    var result
    var res = {
      status:function(x){result=x},
      send:function(){},
      locals:{}
    }
    req.headers["authentication"] = undefined
    var next = function(){}
    userService.isAuthenticatedAppUser(req, res, next)
    assert(result === 400, "unauthenticated user not blocked")
  })

})
