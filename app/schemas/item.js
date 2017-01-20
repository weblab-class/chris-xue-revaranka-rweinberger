var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/app');


// TODO: Fill out the userSchema.
// Hint: a user is an object such as
//     {'username': 'Isaac', 'favoriteFruit': 'apple'}
var itemSchema = new mongoose.Schema({
  itemname: {type: String, required: true, index: {unique: true}},
  description: {type: String, required: true, index: {unique: true}},
}, {collection: 'items'});

var item = mongoose.model('item', itemSchema);

module.exports = item;