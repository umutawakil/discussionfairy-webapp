const utilities    = require('../shared/utilities')
const BadUserInput = require("../types/responses/bad.user.input.js")

//TODO: Move to discussionUtility

module.exports.returnObectIfTrue = function(result,failureObject){
  return result.then(r=>{
    if(r){
      return r
    } else {
      return Promise.reject(failureObject)
    }
  })
}

module.exports.promiseResultDoesNotExist = function(promise){
  return promise.then(r=>{
    //console.log(JSON.stringify(r))
      if(r){
        return false
      } else {
        return true
      }
  })
}

module.exports.convertDiscussionToStorageSets = function(d){
  const cleanedDiscussionSet = {
    table: "discussion",
    data:{
      discussionId: d.discussionId,
      displayDiscussionId: d.displayDiscussionId,
      discussionTitle:d.discussionTitle,
      //updateTime: d.updateTime,
      referenceLink:d.referenceLink,
      language:d.language,
      location:d.location,
      userId:d.userId,
      key: d.key,
      k1: d.k1,
      k2: d.k2,
      k3: d.k3
    }
  }
  const keywordsSets = d.keywords.map(t=>{
    return ({
      table: "topic",
      data: {
          name:t,
          discussionId:d.discussionId,
          language:d.language,
          location:d.location,
          //updateTime:d.updateTime
      }
    })
  })
  return [cleanedDiscussionSet].concat(keywordsSets)
}

//Web/SEO/ META display

module.exports.createKeywordsStringWithAnd = function(d){
    if(!d || !d.keywords){
      return d
    }
    var temp=""
    var keywords = d.keywords

    for(var i=0; i < keywords.length-1; i++){
      temp = temp+", "+keywords[i]
    }
    temp = temp.slice(2,temp.length)
    temp = temp+", and "+keywords[keywords.length-1]
    return temp
}
module.exports.createKeywordsStringWithoutAnd = function(d){
    if(!d || !d.keywords){
      return d
    }
    var temp=""
    var keywords = d.keywords

    for(var i=0; i < keywords.length; i++){
      temp = temp+", "+keywords[i]
    }
    temp = temp.slice(2,temp.length)
    return temp
}
module.exports.createDate = function(d) {
  if(!d || !d.updateTime){
    return d
  }
  var date = new Date(d.updateTime);
  return date.toString();
}
module.exports.createLastMod = function(d) {
  if(!d || !d.updateTime){
    return d
  }
  var date = new Date(d.updateTime);
  return date.toString();
}
