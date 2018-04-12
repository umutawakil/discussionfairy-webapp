//TODO: Leaving this here but it seems that because of the use of the following headers

//ETAG
//IF-None-Match
//IF-Modified-Since

//The browser and server can work together to only return resources that have changed. With this
// in place CSS is cached as long as the etag is different than whats on the server. Amazing.
//What is the drawback to this approach if any?

module.exports.do = function(req, res, next){

  console.log("Filter Called:"+req.url)

  if (req.url.match(/^\/(css|js|img|font|ico|png|jpg)\/.+/)) {
        res.setHeader('Cache-Control', 'public, max-age=3600')
        console.log("Allowing caching on: "+req.url.toString())

  } else {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '0')
    res.header('Pragma', 'no-cache')
  }

  next()
}
