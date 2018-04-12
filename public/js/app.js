function isCurrentPath(contextPath){
    return $("#"+contextPath).attr("id")===contextPath;
}
$(document).ready(function(){

    /*$("#languageMenu").change(function(){
        refreshPageFromFilter()
    })
    $("#locationMenu").change(function(){
        refreshPageFromFilter()
    })*/

    if(isCurrentPath("home-mobile")){
      pickInitialMobileTab();
    }
    if(isCurrentPath("home")){
      initHomePageEvents();
    }

    if(isCurrentPath("view-discussion")){
        initViewDiscussionEvents();
    }
    if(isCurrentPath("browse-topics")){
      initBrowseTopicsEvents();
    }
    if(isCurrentPath("search")){
      initSearchEvents();
    }
})

/*-------------Home Page --------------------------------------------*/

function initHomePageEvents(){
  resizeAudioControlsForCurrentBrowser();
  initStandardFilterFormEvents("","hd","td");
}

function resizeAudioControlsForCurrentBrowser(){
  var width = $("#markerAudio").width();
  if(width === 0){
    width = 300
  }
  width = width + 10
  var widthString = width.toString()+"px";
  $("<style/>", {text: ".discussionAudioControl {width: "+widthString+";}"}).appendTo('head');
  $("#markerAudio").css("display","none");
}

/*function pickInitialMobileTab() {
  var tabPrefix = sessionStorage.tabPrefix;
  if(tabPrefix){
    if(tabPrefix === "new"){
      showNew();
    }
    if(tabPrefix === "popular"){
      showPopular();
    }
  } else {
    sessionStorage.tabPrefix = "popular"
    showPopular();
  }
}

function showTab(active,inactive){
  $("#"+active+"Menu").css("display","block");
  $("#"+inactive+"Menu").css("display","none");

  $("#"+active+"Button").addClass("selectedTab");
  $("#"+inactive+"Button").removeClass("selectedTab");

  sessionStorage.tabPrefix = active;
}

function showPopular(){
  showTab("popular","new");
}

function showNew(){
  showTab("new","popular");
}*/

/*-------------End Home Page --------------------------------------------*/

/*-------------View Discusion--------------------------------------------*/
function initViewDiscussionEvents() {
  //var audioElementWidthInCurrentBrowser = calculateCurrentBrowserAudioElementWidth();
  //setAudioElementWidth(audioElementWidthInCurrentBrowser)

  resizeAudioControlsForCurrentBrowser();

  initContinuousPlayRepliesEvents();
}

/*function calculateCurrentBrowserAudioElementWidth() {
  var audioControls =$(document).find("audio");
  var width = $(audioControls[0]).width();
  return width;
}
function setAudioElementWidth(width) {
    $("#viewDiscussionFirstRecording").css("width",(width + 20) +"px");
}*/
var currentPlaying = {}
var audioControls  = []
function initContinuousPlayRepliesEvents(){

    audioControls =$(document).find("audio");

    $( "audio" ).on( "play",function() {
        /*if($(this).attr("unheard")==="true"){
            markAsHeard($(this).attr("replyId"));
        }*/
       currentPlaying =$(this).attr("id");
    });
    $( "audio" ).on( "ended",function() {
        for(var i = 0; i < audioControls.length; i++){
            if($(audioControls[i]).attr("id")===currentPlaying && (i < audioControls.length-1)){
                var jsElement = $(audioControls[i+1]).get(0);
                jsElement.play();
            }
        }
    });
}

/*---------------------Browse Topics--------------------------*/
function initBrowseTopicsEvents(){

  initStandardFilterFormEvents("/d/topics","ht","tt")
}

function initStandardFilterFormEvents(url,hv,tv){

  /*if(sessionStorage.topicsOrder===hv){
    $("#order").val(hv)
    $("#hot").css("display","block")
    $("#new").css("display","none")
    sessionStorage.topicsOrder = hv
  } else {
    $("#order").val(tv)
    $("#hot").css("display","none")
    $("#new").css("display","block")
    sessionStorage.topicsOrder = tv
  }

  $("#order").change(function(){
    if($("#order").val()===hv){
      $("#hot").css("display","block")
      $("#new").css("display","none")
      sessionStorage.topicsOrder = hv
    } else {
      $("#hotTopics").css("display","none")
      $("#newTopics").css("display","block")
      sessionStorage.topicsOrder = tv
    }
  })*/

  $("#locationMenu").change(function(){
    //$("#locationMenu option[value='']").remove();//Remove default option

    var location = $("#locationMenu").val()
    var language = $("#languageMenu").val()
    if(language==="blank"){
      language=""
    }
    window.location.href=url+"/?location="+location+"&language="+language
  })
  $("#languageMenu").change(function(){
    //$("#languageMenu option[value='']").remove(); //Remove default option

    var location = $("#locationMenu").val()
    var language = $("#languageMenu").val()
    if(location==="blank"){
      location=""
    }
    window.location.href=url+"/?location="+location+"&language="+language
  })

}

/*--------Search-------------------------------------------------------------*/
function initSearchEvents() {
  $("#searchButton").click(function(){
      redirectToDiscussionFromSearch()
  });

  $("#discussionId").on('keyup', function (e) {
    if (e.keyCode == 13) {
        redirectToDiscussionFromSearch()
    }
  });
}
function redirectToDiscussionFromSearch() {
  window.location.href="/"+$("#discussionId").val().replace("#","")
}
