var
  express = require('express'),
  dotenv = require('dotenv').load({silent: true}),
  logger = require('morgan'),
  app = express(),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  expressSession = require('express-session'),
  mongoose = require('mongoose'),
  hash = require('bcrypt-nodejs'),
  path = require('path'),
  request = require('request'),
  passport = require('passport'),
  passportConfig = require('./config/passport.js'),
  Hashes = require('jshashes'),
  parser = require('xml2json'),
  port = process.env.PORT || 3000



// mongoose
mongoose.connect('mongodb://localhost/mean-auth', function(err) {
  if(err) return console.log(err)
  console.log("Connected to MongoDB (mean-auth)")
})



// user schema/model
var User = require('./models/User.js')
var Tweet = require('./models/Tweet.js')


var routes = require('./routes/api.js')



// define middleware
app.use(express.static(path.join(__dirname, '../client')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/user/', routes)

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})


// ------------------------ AMAZON

// var aws = {
//   access_key_id: 'AKIAJQFCOZHIGEZ5M33A',
//   secret_access_key: 'Ng3K3Ql+k0awTGEH9WTbdJENehvr6+o4oXyDWOX+'
// }


// app.get('/api/test', function(req, res) {
//
//   var timestamp = (new Date()).toISOString()
//
//   var exampleRequestString = `webservices.amazon.com
// /onca/xml
// AWSAccessKeyId=${aws.access_key_id}&AssociateTag=mytag-20&ItemId=0679722769&Operation=ItemLookup&ResponseGroup=Images%2CItemAttributes%2COffers%2CReviews&Service=AWSECommerceService&Timestamp=${timestamp}&Version=2013-08-01`
//
//
//   var testhash = new Hashes.SHA256().hex_hmac(aws.secret_access_key, exampleRequestString)
//
//   console.log(testhash)

  // var apiUrl = 'http://webservices.amazon.com/onca/xml?AWSAccessKeyId='+aws.access_key_id+'&AssociateTag=mytag-20&ItemId=0679722769&Operation=ItemLookup&ResponseGroup=Images%2CItemAttributes%2COffers%2CReviews&Service=AWSECommerceService&Timestamp=' + timestamp + '&Version=2013-08-01&Signature=' + testhash
  // console.log(apiUrl)
  // console.log(timestamp)

//   request.get(apiUrl, function(err, response, body) {
//     res.send(body)
//   })
// })

// ------------------------ AMAZON


app.get('/search', function(req, res) {
  console.log(req.query)
  var apiUrl = 'http://api.walmartlabs.com/v1/search?query='
  var apiKey = '&format=json&facet=on&facet.range=price%3A%5B1+TO+50%5D&apiKey=khaernw7exvbwswcvbupfyw2&sort=relevance&numItems=25'
  // var combinedApi = {
  //   products: {
  //     walmart: [],
  //     etsy: []
  //   }
  //   totalCount:
  // }
  request.get(apiUrl + req.query.term + apiKey, function(err, walmartResponse, walmartBody) {
    console.log(walmartBody)
    console.log(walmartResponse)
      res.json(walmartBody)
      // request.get()
      // theXml = res
      // parser.toJson(theXml)
    // arr.push(walmartBody)
    // request({
    // res.json(combinedApi)

})
})

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res) {
  res.status(err.status || 500)
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }))
})


app.listen(port, function() {
  console.log("Listening for requests on port:", port)
})
