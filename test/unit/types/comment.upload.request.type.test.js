const CommentUploadRequest = require("../../../types/comment/example.upload.form")
const expect               = require('chai').expect
const assert               = require('chai').assert

describe("CommentUploadRequest Type:",function(){

  it("returns false when all fields missing",function(){
      var request = new CommentUploadRequest()
      assert(request.validate(CommentUploadRequest).valid === false,"Returned true on an empty object")
  })

  it("returns true when all required fields are defined",function(){
      var request = new CommentUploadRequest()
      request.discussionId = "XXXXXX"
      request.extension = "m4a"
      request.userId = "XXXXX"
      assert(request.validate(CommentUploadRequest).valid === true,"Returned false on a fully defined object")
  })

  it("returns false when a required field is missing",function(){
      var request = new CommentUploadRequest()
      request.discussionId = "XXXXXX"
      request.extension = "m4a"
      assert(request.validate(CommentUploadRequest).valid === false,"Returned true on a partially defined object")
  })

  it("returns false compared against the wrong type",function(){
      var request = new CommentUploadRequest()
      request.discussionId = "XXXXXX"
      request.extension = "m4a"
      request.userId = "XXXXX"
      assert(request.validate(String).valid === false,"Returned true on wrong comparison type")
  })

  it("returns false with invalid extension",function(){
      var request = new CommentUploadRequest()
      request.discussionId = "XXXXXX"
      request.extension = "wma"
      request.userId = "XXXXX"
      assert(request.validate(CommentUploadRequest).valid === false,"Returned true on invalid extension")
  })


})
