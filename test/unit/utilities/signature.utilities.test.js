const signatureUtility = require("../../../utilities/signature.utilities.js")
const assert           = require('chai').assert

describe("Signature Utility:",function(){

  it("creates a signature key",function(done){
      var signatureKey = signatureUtility.getSignatureKey("sfsfsfs","dateStamp","regionName","serviceName")
      assert(signatureKey,"Invalid Signature Key created")
      done()
  })

  it("creates a signature",function(done){
      //aws signature: dd0226a43fea9cc1b2d93cbd8c1c1882d4f0abe4e9cfdbc1bc822e5a38c3b239
      //signatureUtility.getSignatureKey("sfsfsfsf","dateStamp","regionName","serviceName")
      var signatureKey = signatureUtility.getSignatureKey("sfsfsfsf","dateStamp","regionName","serviceName")
      var signature    = signatureUtility.sign(signatureKey,"sfsfsf")
      assert(signature.toString()==="dd0226a43fea9cc1b2d93cbd8c1c1882d4f0abe4e9cfdbc1bc822e5a38c3b239","Invalid signature created")
      done()
  })

  it("creates a simple signature",function(){
    //997b650ef0d4f97b92a844c3c489582ec7923be9b27870125d069b72ace000f9
    //var signature = signatureUtility.getSimpleSignature("sfsfsf","sfsfsf")
      var signature = signatureUtility.getSimpleSignature("sfsfsf","sfsfsf")
      assert(signature==="997b650ef0d4f97b92a844c3c489582ec7923be9b27870125d069b72ace000f9","No Signature created")
  })

  it("verifies an encoded bit of data and a given signature",function(){
    var info = {
      name:"some_name"
    }
    var secret = "XXXXXXXXX"
    var infoEncoded = new Buffer(JSON.stringify(info)).toString('base64')
    var signature   = signatureUtility.getSimpleSignature(infoEncoded,secret)

    var result = signatureUtility.verifySignature(infoEncoded,signature,secret).then(result=>{
      assert(result === true,"failure validation returned")
    })
  })

})
