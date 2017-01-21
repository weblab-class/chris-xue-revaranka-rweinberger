var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/app');


// TODO: Fill out the userSchema.
// Hint: a user is an object such as
//     {'username': 'Isaac', 'favoriteFruit': 'apple'}
var itemSchema = new mongoose.Schema({
  itemname: {type: String, required: true, index: {unique: false}},
  price: {type: Number, required: true, index: {unique: false}},
  description: {type: String, required: true, index: {unique: false}},
  tags: {type: Array, required: false, index: {unique: false}},
  category: {type: String, required: true, index: {unique:false}},
}, {collection: 'items'});

var item = mongoose.model('Item', itemSchema);

module.exports = item;