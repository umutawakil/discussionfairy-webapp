
var   fakePool    = require("./pool.fake.js")

module.exports.createPool = function(params){
  console.log("Returning pool")
  return fakePool
}

module.exports.format = function(query,inserts){

}
