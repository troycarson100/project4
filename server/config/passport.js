var
	passport = require('passport'),
	localStrategy = require('passport-local' ).Strategy,
	User = require('../models/User.js')

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(function(id, done) {
  User.findOne({username:id}).populate('likes').exec(function(err, user){
    done(err, user)
  })
})



module.exports = passport
