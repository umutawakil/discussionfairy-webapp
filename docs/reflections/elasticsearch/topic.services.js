
const sharedUtility        = require('../shared/utilities')
const AWS                  = require("aws-sdk")
const settings             = require("../settings.json")
let   options              = {
  hosts: [process.env.ESEndPointURL],
  connectionClass: require('http-aws-es'),
  awsConfig: new AWS.Config({region:'us-east-1'})
}
const elasticSearch        = require('elasticsearch').Client(options)
const browseUtility        = require('../utilities/browse.utility.js')
const elasticSearchUtility = require('../utilities/elasticsearch.utility.js')

module.exports.browse = function(input) {
  //return browseUtility.browse(input,"keyword","children","timestamp")
  return browseUtility.browse(input,"keyword","lastModificationTimestamp")
}


module.exports.updateOrCreateKeyword = function(keyword,discussionInfo){
  var promise = new Promise(function(resolve,reject){

    getKeywordFromElasticSearch(keyword,discussionInfo).then( result =>{
      if(result.responses && result.responses[0].hits.hits.length > 0){
        updateExistingKeyword(keyword,result.responses[0].hits.hits,reject,resolve)
      } else {
        createNewKeyword(keyword,discussionInfo,reject,resolve)
      }
    }).catch(error=>{ reject(error)})

  })
  return promise
}

function updateExistingKeyword(keyword,hits,reject,resolve) {
  var newSource = hits[0]._source
  newSource.children = newSource.children + 1

  var params = {
    id: hits[0]._id,
    index:settings.elasticSearchIndex,
    type:"keyword",
    body:{ doc:newSource}
  }
  elasticSearch.update(params,function(error,response){
      if(error){
        reject(error)
        return
      }
      resolve(response)
  })
}

module.exports.updateTopicModificationTime = function(keywordName) {

  var promise = new Promise(function(resolve,reject){
    elasticSearchUtility.get(keywordName,"keyword").then((keyword)=>{

      keyword.lastNewModifierTimestamp  = new Date().getTime()
      keyword.lastModificationTimestamp = new Date().getTime()
      var params = {
        id: keywordName.toLowerCase(),
        index:settings.elasticSearchIndex,
        type:"keyword",
        body:{ doc:keyword}
      }
      elasticSearch.update(params,function(error,response){
          if(error){
            reject(error)
            return
          }
          resolve(response)
      })
    })
  })
  return promise
}

function createNewKeyword(keyword,discussionInfo,reject,resolve) {
  newSource = {
    language: discussionInfo.language,
    location: discussionInfo.location,
    name: keyword,
    displayName: keyword.toLowerCase(),
    timestamp: discussionInfo.timestamp,
    children: 1,
    lastNewModifierTimestamp:  new Date().getTime(),
    lastModificationTimestamp: new Date().getTime()
  }

  var params = {
    id: keyword.toLowerCase(), //discussionInfo.location+discussionInfo.language,
    index:settings.elasticSearchIndex,
    type:"keyword",
    body:newSource
  }
  elasticSearch.create(params,function(error,response){
      if(error){
        reject(error)
        return
      }
      resolve(response)
  })
}

function getKeywordFromElasticSearch(keyword,info){
  var promise = new Promise(function(resolve,reject){

    var matches = [
      { term: { name: keyword.toLowerCase()} },
      { term: { location: info.location} },
      { term: { language: info.language} }
    ]

    var q1 = {
      query: {
        bool:{ must: matches}
      },
      from: 0,
      size: 1
    }

    var header = {index:settings.elasticSearchIndex,type: "keyword"}
    var params = { body:[header,q1]}

    elasticSearch.msearch(params,function(error,response){
        if(error){
          reject(error)
          return
        }
        //console.log("MATCH: "+JSON.stringify(response))
        resolve(response)
    })
  })
  return promise
}
