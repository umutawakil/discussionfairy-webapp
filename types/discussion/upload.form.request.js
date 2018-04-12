
//TODO: This isn't entirely valid. UserId needs to be added on the serverside

function DiscussionUploadRequestForm(){
  this.userId="XXXXXX",
  this.discussionId="someId",
  this.discussionTitle="This is a valid discussion Title"
  this.keywords=["a","b","c"],
  this.location="London",
  this.language="Japanese",
  this.extension="mp3"
}

module.exports = DiscussionUploadRequestForm
