
var BaseType = function(){
  this.fields = []
}

BaseType.prototype.validate = function(type){
  var result = {
    message:"",
    valid:true
  }

  if(!(this instanceof type)){
    result.message = "Wrong type: input object is "+this.constructor.name+" but expected "+type.constructor.name
    result.valid = false
    return result
  }

  var missingFields = this.fields.filter(f => {
    return !this[f]
  })
  if(missingFields.length === 0){
    return result
  }
  result.valid = false
  result.message = "Missing fields: "+JSON.stringify(missingFields)+" on input object "+this.constructor.name

  return result
  /*for(k in this.fields){
    if(!this[k]) {
      console.log(k+": "+this[k])
      return false
    }
  }
  return true*/
}


module.exports = BaseType
