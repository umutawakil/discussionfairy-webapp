
function ApplicationError(message,error){
  this.message=message
  this.code=500
  this.error=error
}
module.exports = ApplicationError
