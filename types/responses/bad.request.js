function BadRequest(message,error){
  this.message=message
  this.code=400
  this.error=error
}
module.exports = BadRequest
