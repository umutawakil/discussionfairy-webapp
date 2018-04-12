
module.exports.setMockReturnEmptyPromise = function(object){
  object.callsFake(()=>{
    return Promise.resolve({})
  })
}

module.exports.setMockReturnPromise = function(object,response) {
  object.callsFake(()=>{
    return Promise.resolve(response)
  })
}
