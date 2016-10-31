var express = require('express'),
  app = express(),
  router = express.Router(),
  passport = require('passport')

var User = require('../models/User.js')


router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      })
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      })
    })
  })
})

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).json({
        err: info
      })
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        })
      }
      res.status(200).json({
        status: 'Login successful!',
        user: user
      })
    })
  })(req, res, next)
})

router.get('/logout', function(req, res) {
  req.logout()
  res.status(200).json({
    status: 'Bye!'
  })
})

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    })
  }
  res.status(200).json({
    status: true,
    user: req.user
  })
})



app.get('/users', function(req, res){
  User.find({}, function(err, users){
    if(err) return console.log(err)
    res.json(users)
  })
})

app.get('/users/:id', function(req, res){
  User.findById(req.params.id).populate('tweets').exec(function(err, user){
    if (err) return console.log(err)
    res.json(user)
  })
})

app.get('/users/:id/tweets', function(req, res){
  Tweet.findById(req.params.id).populate('_by').exec(function(err, tweets){
    if (err) return console.log(err)
    res.render(tweets)
  })
})

app.post('/users/:id/tweets', function(req, res){
  User.findById(req.params.id, function(err, user){
    var newTweet = new Tweet(req.body)
    newTweet._by = User._id
    newTweet.save(function(err){
      if (err) return console.log(err)
      user.tweets.push(newTweet)
      user.save(function(err) {
        if(err) return console.log(err)
        res.redirect('users/:id/tweets/')
    })
  })
})
})


module.exports = router
