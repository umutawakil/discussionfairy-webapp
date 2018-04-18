const crypto          = require("crypto-js")
//const keyValueService = require("../services/keyvalue.services.js")

//This uses 2 different keys. One thats tied to a role and one from a KV store.
module.exports.getSignatureKey = function(key, dateStamp, regionName, serviceName) {
    var kSecret = "AWS4" + key
    var kDate = crypto.HmacSHA256(dateStamp, kSecret)
    var kRegion = crypto.HmacSHA256(regionName, kDate)
    var kService = crypto.HmacSHA256(serviceName, kRegion)
    var kSigning = crypto.HmacSHA256("aws4_request", kService)
    return kSigning;
}

module.exports.sign = function(signatureKey,stringToSign) {
    return crypto.HmacSHA256(stringToSign,signatureKey)
}

module.exports.getSignature = function(stringToSign,secretKey,dateStamp,regionName, serviceName) {
    var signingKey = this.getSignatureKey(secretKey,dateStamp,regionName,serviceName)
    return this.sign(signingKey,stringToSign).toString()
}

module.exports.getSimpleSignature = function(stringToSign,secret) {
    //console.log(JSON.stringify(stringToSign))
    //console.log(JSON.stringify(secret))
    return crypto.HmacSHA256(stringToSign,secret).toString()
}

module.exports.verifySignature = function(infoEncoded,potentialSignature,secret) {
    var signature = this.getSimpleSignature(infoEncoded,secret)

    if(signature !== potentialSignature) {
        var failure = {
          code:400,
          message:"Invalid signature on object creation attempt"
        }
        return Promise.reject(failure)
    } else {
      return Promise.resolve(true)
    }
}
