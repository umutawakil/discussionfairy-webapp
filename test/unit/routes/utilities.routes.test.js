const assert = require('chai').assert

module.exports.expectDatabaseFailure = function(req){
  assert(req.status !== 404 && (req.status === 500 || req.status === 400),"Route failed with code: "+req.status)
}
