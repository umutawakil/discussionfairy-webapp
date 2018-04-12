
const sharedUtility     = require('../shared/utilities.js')
const validationUtility = require('../utilities/validation.utility.js')
const AWS               = require("aws-sdk")
const settings          = require("../settings.json")

let   options           = {
  hosts: [process.env.ESEndPointURL],
  connectionClass: require('http-aws-es'),
  awsConfig: new AWS.Config({region:'us-east-1'})
}
const elasticSearch     = require('elasticsearch').Client(options)

module.exports.browse = function(input,document,sortProperty) {

  var promise = new Promise(function(resolve,reject){

    browse(input,document,sortProperty).then(result =>{
        resolve(result)

    }).catch(result =>{
        if(result instanceof Error)  {
            reject({isNonUserError:true,error:result})
        } else {
            reject({isNonUserError:false,result:result})
        }
    })
  })
  return promise
}

function browse(input,document,sortProperty) {
    var promise = new Promise(function(resolve,reject){

      var inputValidation = validationUtility.validateBrowseDiscussionsViewInput(input)
      if(!inputValidation.valid) {
          reject({message:inputValidation.message+", INPUT: "+JSON.stringify(input)})
          return
      }

      var q1  = createBrowseBody(input,sortProperty)
      var q2  = languagesQuery(input)
      var q3  = locationsQuery(input)
      var header = {index:settings.elasticSearchIndex,type: document}
      var params = { body:[header,q1,header,q2,header,q3]}

      module.exports.msearch(params,function(error,response){
          if(error){
            reject(error)
            return
          }

          //TODO: Is it noted in the ES doc you need to check the error object and response itself?
          if(response.responses[0].error){
            reject(new Error(response.responses[0].error))
            return
          }
          if(response.responses[1].error){
            reject(new Error(response.responses[1].error))
            return
          }
          if(response.responses[2].error){
            reject(new Error(response.responses[2].error))
            return
          }

          var cleanedResults   = []
          var cleanedLanguages = []
          var cleanedLocations = []

          response.responses[0].hits.hits.forEach(function(x){
            cleanedResults.push(x._source)
          })
          var languageAggregations = response.responses[1].aggregations.languagues
          if(languageAggregations){
            languageAggregations.buckets.forEach(function(x){
              cleanedLanguages.push(x.key)
            })
          } else {
            cleanedLanguages = []
          }
          var locationAggregations = response.responses[2].aggregations.locations
          if(locationAggregations){
            locationAggregations.buckets.forEach(function(x){
              cleanedLocations.push(x.key)
            })
          } else {
            cleanedLocations = []
          }
          resolve({results:cleanedResults,languages:cleanedLanguages,locations:cleanedLocations})
      })

    })
    return promise
}

function createBrowseBody(input,sortAttribute) {
  var queryCriteria;
  if(!input.location && !input.language && !input.topic) {
      queryCriteria = {
          match_all:{}
      }
  } else {
    var matches = []
    if(input.location){
      //matches.push({ match:  {location: [input.location,""]}})
      var locationAndInternationalQuery = {
          bool: {
            should: [{ term:  {location: input.location}},{ term:  {location: ""}}],
            minimum_should_match: 1,
          }
        }
    }
    //International location
    //matches.push({ match:  {location: ""}})
    if(input.language) {
      matches.push({ match:  {language: input.language}})
    }
    if(input.topic) {
      matches.push({ match: {keywords: input.topic}})
    }
    queryCriteria = {
       bool: {
         must: matches
       }
    }
    if(input.location) {
      queryCriteria.bool["should"] = locationAndInternationalQuery
    }
  }

  var baseSearch = {
        query: queryCriteria,
        from: input.offset,
        size:settings.maxSearchResultsPerPage,
        sort:{}
  }
  baseSearch.sort[sortAttribute] = {order:"desc"}
  return baseSearch
}

module.exports.createBrowseBody = function(input,sortAttribute) {
  return createBrowseBody(input,sortAttribute)
}

function locationsQuery(input) {
    var queryS = { match_all:{} };
    var response ={
              query: queryS,
              size:0,
              aggs : {
                locations : {
                    terms : { field: "location" }
                }
              }
    }
    return response
}


function languagesQuery(input) {
    var matchQuery = {match_all:{}}
    var response ={
              query: matchQuery,
              size:0,
              aggs : {
                languagues : {
                    terms : { field : "language" }
                }
              }
    }
    return response
}

module.exports.msearch = function(params,callback){
  return elasticSearch.msearch(params,callback)
}

//------------------------------------------------------------------------ //

module.exports.createSchema = function() {
  var promise = new Promise(function(resolve,reject){

          var params = {
            index:settings.elasticSearchIndex,
            body:{
              mappings: {
                discussion: {
                  _all: { enabled: false},
                  properties:{
                    likes:{
                      type: "integer",
                      index: "not_analyzed"
                    },
                    timestamp:{
                      type: "long",
                      index: "not_analyzed"
                    },
                    lastNewModifierTimestamp: {
                      type: "long",
                      index: "not_analyzed"
                    },
                    lastModificationTimestamp: {
                      type: "long",
                      index: "not_analyzed"
                    },
                    language: {
                      type: "string",
                      index: "not_analyzed"
                    },
                    location:{
                      type: "string",
                      index: "not_analyzed"
                    },
                    keywords:{
                      type: "string",
                      index: "not_analyzed"
                    },
                    displayKeywords:{
                      type: "string",
                      index: "not_analyzed"
                    }
                  }
                },
                keyword: {
                  _all: { enabled: false},
                  properties:{
                    name: {
                      type: "string",
                      index: "not_analyzed"
                    },
                    displayName: {
                      type: "string",
                      index: "not_analyzed"
                    },
                    children: {
                      type: "integer",
                      index: "not_analyzed"
                    },
                    timestamp:{
                      type: "long",
                      index: "not_analyzed"
                    },
                    lastNewModifierTimestamp: {
                      type: "long",
                      index: "not_analyzed"
                    },
                    lastModificationTimestamp: {
                      type: "long",
                      index: "not_analyzed"
                    },
                    language: {
                      type: "string",
                      index: "not_analyzed"
                    },
                    location:{
                      type: "string",
                      index: "not_analyzed"
                    },
                  }
                }
              }
            }
          }

          elasticSearch.indices.create(params,function(error,response){
              if(error){
                reject(error)
                return
              }

              if(response.error){
                reject(new Error(response.error))
                return
              }
              //console.log(response)
              resolve(response)
          })

  })
  return promise
}

module.exports.clearDatabase = function() {
  var promise = new Promise(function(resolve,reject){
    elasticSearch.indices.delete({index:'_all'},function(error,response){
        if(error){
          reject(error)
          return
        }
        console.log(JSON.stringify(response))
        resolve(response)
    })
  })
  return promise
}
