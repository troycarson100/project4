var express = require('express'),
  app = express(),
  router = express.Router(),
  passport = require('passport')

var User = require('../models/User.js')
var Like = require('../models/Like.js')


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



router.get('/users', function(req, res){
  User.find({}).populate('likes').exec(function(err, users){
    if(err) return console.log(err)
    res.json(users)
  })
})

router.get('/users/:id', function(req, res){
  User.findById(req.params.id).populate('likes').exec(function(err, user){
    if (err) return console.log(err)
    res.json(user)
  })
})

router.get('/users/:id/likes', function(req, res){
  Like.findById(req.params.id).populate('_by').exec(function(err, likes){
    if (err) return console.log(err)
    res.render(likes)
  })
})

router.post('/users/:id/likes', function(req, res){
  User.findById(req.params.id, function(err, user){
    var newLike = new Like(req.body)
    newLike._by = user._id
    newLike.save(function(err){
      if (err) return console.log(err)
      user.likes.push(newLike)
      user.save(function(err, newUser) {
        if(err) return console.log(err)
          res.json({likeIt: true, message: 'Success is true', user: newUser})
        // res.redirect('users/:id/likes/')
      })
    })
  })
})
router.delete('/users/:userId/likes/:itemId', function(req, res){
  User.findById(req.user._id, function(err, user) {
    if(err) return console.log(err)
    Like.findOne({itemId: req.params.itemId, _by: req.user._id}, function(err, like) {
      if(err) return console.log(err)
      user.update({ $pull: {likes: like._id}}, {new: true}, function(err, user) {
        if(err) return console.log(err)
        like.remove(function(err) {
          res.json({likeIt: false, message: "Like deleted...", user: user, itemUnliked: req.params.itemId})
        })
      })
    })
  })
})

//reset user likes
// User.findById("581a1c9c8b875652f6b6bf49", function(err, user) {
//   user.likes = []
//   user.save()
// })

module.exports = router
