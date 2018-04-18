

module.exports.createMobilePassiveUser = function(req) {
  return Promise.resolve({})
}

module.exports.isAuthenticatedAppUser = function(req, res, next){
    res.locals.userId = "sfsfsfsfs"
    req.userId = "sfsfsfsfs"
    res.locals.authenticated = true
    next()
}
