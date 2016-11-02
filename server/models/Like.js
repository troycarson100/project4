var mongoose = require('mongoose')
var Schema = mongoose.Schema


var Like = new Schema({
  _by: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: String,
  categoryPath: String,
  categoryNode: String,
  url: String,
  image: String,
  price: Number,
  itemId: Number
})


module.exports = mongoose.model('Like', Like)
