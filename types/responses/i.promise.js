
function IPromise(){
  this.promise = new Promise((x,y)=>{
    this.resolve=x;
    this.reject=y;
  })
}
module.exports = IPromise
