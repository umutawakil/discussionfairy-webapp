const s3Decision               = require("../../../decisions/s3.decisions.js")
const S3UploadInputParameters  = require("../../../types/s3/upload.input.parameters.js")
const assert                   = require('chai').assert

describe("S3 Decisions:",function(){
    it("creates s3 upload form parameters when input is valid",function(done){
      s3Decision.createUploadFormParameters(new S3UploadInputParameters()).then(r=>{
        assert(r,"No upload parameters returned")
        done()
      })
    })
})
