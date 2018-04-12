const createDOMPurify = require('dompurify')
const { JSDOM }       = require('jsdom')
const window          = (new JSDOM('')).window
const DOMPurify       = createDOMPurify(window)
const crypto          = require("crypto")

//TODO: check if urls are tested

const URLSafeCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=`.".split('')
module.exports.URLSafeCharacters = URLSafeCharacters

module.exports.isURLSafe = function(input) {
  var inputCharacters = input.split('')
  var y = inputCharacters.filter( x => {
    return URLSafeCharacters.includes(x)
  })
  return y.length === inputCharacters.length
}

module.exports.toTitleCase = function(str)
{
    return str.replace(/\w\S*/g,
      function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}
    );
}

module.exports.generateUUID = function(){
  return crypto.randomBytes(16).toString("hex")
}

module.exports.sanitizePotentialHTML = function(x) {
  return DOMPurify.sanitize(x)
}

module.exports.objectToMap = function(x) {
  return new Map(entries(x));
}
function *entries(obj) {
    for (let key in obj)
        yield [key, obj[key]];
}

module.exports.isNumber = function(x) {
  return Number.isInteger(parseInt(x))
}

module.exports.checkAllPropertiesDefined = function(input,comparison){
  for (var k in comparison) {
      if(!input[k]){
        return false
      }
  }
  return true
}

module.exports.createSimplePromise = function(thisObject,nonBlockingFunction,params) {
  var promise = new Promise(function(resolve,reject){
    executeSimplePromise(thisObject,nonBlockingFunction,params,resolve,reject)
  })
  return promise
}

function executeSimplePromise(thisObject,nonBlockingFunction,params,resolve,reject){
  try {
    thisObject[nonBlockingFunction](params, function(err, data) {
      if (err){
         console.log("Error ON: "+nonBlockingFunction+" Failing Input Params: "+JSON.stringify(params))
         reject(err)
      } else {
        resolve(data)
      }
    })
  } catch (exception){
    console.log("Error ON: "+nonBlockingFunction+" Failing Input Params: "+JSON.stringify(params))
    reject(exception)
  }
}
