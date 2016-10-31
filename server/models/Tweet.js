var mongoose = require('mongoose')
var Schema = mongoose.Schema


var Tweet = new Schema({
  _by: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: String,
  content: String
})


module.exports = mongoose.model('tweets', Tweet)
