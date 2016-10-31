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

app.get('/search', function(req, res) {
  var apiUrl = 'http://api.walmartlabs.com/v1/search?query='
  var apiKey = '&format=json&apiKey=khaernw7exvbwswcvbupfyw2'
  request.get(apiUrl + req.query + apiKey, function(err, walmartResponse, walmartBody) {

    var img = JSON.parse(walmartBody).data[0].items.thumbnailImage
    res.send('<img src="' + img + '">')
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
