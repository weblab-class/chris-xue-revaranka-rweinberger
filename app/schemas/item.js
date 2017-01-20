var mongoose = require('mongoose');


// TODO: Fill out the userSchema.
// Hint: a user is an object such as
//     {'username': 'Isaac', 'favoriteFruit': 'apple'}
var itemSchema = new mongoose.Schema({
  itemname: {type: String, required: true, index: {unique: true}},
  description: {type: String, required: true, index: {unique: true}},
});

var item = mongoose.model('Item', itemSchema);

module.exports = item;