
const utilities        = require('../shared/utilities')
//const jwt              = require('jsonwebtoken')
//const settings         = require('../settings.json')
//const dynamoDBService  = require('../services/dynamodb.services')
//const security         = require("../services/security.services")

function lazyLoadDynamoDBService() {
  return require('../services/dynamodb.services')
}

module.exports.createMobilePassiveUser = function(req) {

    var user = createUserDataObject(req)
    //var params = createDBRequestParameters(user)

    return lazyLoadDynamoDBService().simpleObjectSave(user,"user").then(()=>{
      return createUserToken(user)
    })

    //console.log("Params: "+JSON.stringify(params))

    /*var promise = new Promise(function(resolve,reject){
      dynamodb.putItem(params, function(err, data) {
          if (err) {
            reject(Error(err))
          }  else {
            resolve(createUserToken(user))
          }
      })
    })
    return promise*/
}

// User data object sent back to mobile app but also wrapped for sending to dynamodb
function createUserDataObject(req) {
    var date = new Date()

    var user = {
                 userId:utilities.generateUUID(),
                 userAgent: req.headers['user-agent'],
                 creationTime: date.getTime().toString(),
                 creationDate: date.toISOString()
               }
    user.ip = req.ip

    if(req.headers['x-forwarded-for']) {
        user.proxyIp = req.headers['x-forwarded-for']
    }

    return user
}

//DynamoDB wrapper object of the user data object
/*function createDBRequestParameters(user) {
  var params = {
               Item: {
                userId: {S: user.userId },
                userAgent: {S: user.userAgent},
                initialIp: {S:user.ip},
                creationTime: {N:user.creationTime},
                creationDate: {S:user.creationDate}
               },
               TableName: "user"
  }
  if(user.proxyIp){
    params.Item.proxyIp = user.proxyIp
  }
  return params
}*/

function createUserToken(user) {
  //var payload = {userId: user.userId,keyNumber: settings.keyNumber}

  var promise = new Promise((resolve,reject)=> {
    resolve(user.userId)
    /*jwt.sign(payload,settings.secretKey,{ algorithm: settings.JWTAlgorithm},
      function(err,token){
        if(err){
          logger.log(err)
          reject(new Error(error))
        }
        if(token) {
          resolve(token)
        }
    })*/
  })
  return promise
}

module.exports.isAuthenticatedAppUser = function(req, res, next){

  var authenticationHeader = req.headers['authentication']
  console.log("isAuthenticatedAppUser: "+authenticationHeader)
  if(!authenticationHeader) {
    //security.log(req,"No Authenticaiton Header provided")
    res.status(400)
    res.send("Bad Request")
    return
  }
  var token = authenticationHeader.replace("Bearer","").trim()

  if(token){
    res.locals.userId = token
    req.userId = token
    res.locals.authenticated = true
    next()
    return
  }

  /*jwt.verify(token, settings.secretKey,{ algorithm: settings.JWTAlgorithm}, function(err, decoded) {
    //If the token is valid and decoded  but signature is wrong check the keyNumber.

    if(!err && decoded) {
        //console.log("Authenticated App User Detected")
        //console.log("USER_ID: "+decoded.userId)
        res.locals.userId = decoded.userId
        req.userId = decoded.userId
        res.locals.authenticated = true
        next()
        return
    }
    if(err && decoded && (decoded.keyNumber !== settings.keyNumber)) {
      console.log("Expired KeyNumber")
      next()
      return
    }*/
  //security.log(req,"Invalid jwt or non-existent supplied",err)
  res.status(400)
  res.send("Bad Request")

}
