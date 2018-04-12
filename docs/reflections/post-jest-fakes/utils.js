const cheerio   = require('cheerio')

function verifyResultsAppear(response,done) {
  try {
    const $ = cheerio.load(response.text)
    var list1 = $($(".discussionList")[0])
    //var list2 = $($(".discussionList")[1])
    var length1 = list1.find($(".discussionsListElement")).length
    //var length2 = list2.find($(".discussionsListElement")).length
    //assert(length1 === length2,"New and Hot results don't match")
    assert(length1 >= 2,"1st list is missing elements size: "+length1)
    //assert(length2 > 2,"2nd list is missing elements size: "+length2)
    done()

  } catch(exception){
    done(exception)
  }
}


/*function objectToQueryString(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

function createFakeDiscussionInfo() {
  var newDiscussionInfo = {
    userId: sharedUtility.generateUUID(),
    discussionId: sharedUtility.generateUUID().substr(0,settings.maxDiscussionIdLength),
    keywords: ["b","c"],
    keywordOne:"Health-care",
    keywordTwo:"S",
    keywordThree: "G",
    discussionTitle: "A test title..."+sharedUtility.generateUUID(),
    location: "Brazil",
    language: "Portuguese",
    comments: 0,
    extension: "m4a",
    timestamp: new Date().getTime(),
    likes: Math.floor(Math.random() * 100) + 1,
    lastNewModifierTimestamp:   new Date().getTime(),
    lastModificationTimestamp:  new Date().getTime()
  }
  newDiscussionInfo.key = discussionUtility.createDiscussionKey(newDiscussionInfo)
  //console.log("DISCUSSION_ID: "+newDiscussionInfo.discussionId)
  return newDiscussionInfo
}*/
