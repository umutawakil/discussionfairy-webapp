var BaseType = require("./base.type.js")

var ChildType = function(){
  BaseType.apply(this,arguments)
  this.fields = ["name","height","age"]
}
ChildType.prototype = new BaseType()
ChildType.prototype.constructor = ChildType

/*ChildType.prototype.validateChild = function(){
  return this.validate()
}*/

module.exports = ChildType
