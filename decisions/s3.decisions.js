
const settings                 = require('../settings.json')
const signatureUtility         = require('../utilities/signature.utilities')
const S3UploadInputParameters  = require("../types/s3/upload.input.parameters.js")
const utilities                = require("../shared/utilities.js")
const BadUserInput             = require("../types/responses/bad.user.input.js")

module.exports.createUploadFormParameters = function(inputParameters){
  var redirectURL           = createRedirectURL(inputParameters.type,inputParameters.domainName,inputParameters.object,inputParameters.s3VerificationSecret)
  var date                  = new Date
  var numericDate           = getNumericDate(date)
  var m                     = {}
  var xmzCredential         = inputParameters.accessKey+"/"+numericDate+"/us-east-1/s3/aws4_request"
  var xmzDate               = getIsoDate(date)
  var xmzAlgorithm          = settings.xmzAlgorithm
  var contentLengthRange    = settings.maxImageSize
  var expDate               = getExpirationDate(date)

  var policyDocument = JSON.stringify({ expiration: expDate,
                            conditions:[
                              {'bucket': inputParameters.recordingSourceBucket},
                              {'acl': "public-read"},
                              ["starts-with","$key",inputParameters.key],
                              {'success_action_redirect': redirectURL},
                              ['content-length-range',0,contentLengthRange],
                              {'x-amz-credential': xmzCredential},
                              {'x-amz-algorithm': xmzAlgorithm},
                              {'x-amz-date': xmzDate}
                            ]
                      })

  //policyDocument = policyDocument.replace(/\n/g, '').replace(/\r/g,'')
  var encodedPolicyDocument = new Buffer(policyDocument).toString('base64')
  var signature = signatureUtility.getSignature(encodedPolicyDocument,inputParameters.secretKey,numericDate,"us-east-1","s3")

  m.key                = inputParameters.key
  m.recordingSourceURL = inputParameters.recordingSourceURL
  m.recordingUploadURL = inputParameters.recordingUploadURL
  m.redirectURL        = redirectURL
  m.contentLengthRange = contentLengthRange
  m.xmzCredential      = xmzCredential
  m.xmzDate            = xmzDate
  m.xmzAlgorithm       = xmzAlgorithm
  m.policy             = encodedPolicyDocument
  m.signature          = signature

  return Promise.resolve(m)
}

function createRedirectURL(type,domainName,dataObject,s3VerificationSecret) {
  //console.log(JSON.stringify(info))
    var encodedInfo = new Buffer(JSON.stringify(dataObject)).toString('base64') //What about time?
    var queryString = "signature="+encodeURIComponent(signatureUtility.getSimpleSignature(encodedInfo,s3VerificationSecret))+"&info="+encodeURIComponent(encodedInfo)
    return "https://"+domainName+"/d/"+type+"/create?"+queryString
    //return "https://"+process.env.DomainName+"/d/discussion/create?"+queryString
}

function getNumericDate(date){
    var x = getIsoDate(date)
    return x.substring(0,x.indexOf('T'))
}

function getIsoDate(date) {
  var isodate = date.toISOString().replace(/-/g,"").replace(/:/g,"")
  isodate = isodate.substring(0,isodate.indexOf('.'))+"Z"
  return isodate
}

function getExpirationDate(date) {
  var tomorrow = new Date();
  tomorrow.setDate(date.getDate()+1);
  return tomorrow.toISOString()
}
