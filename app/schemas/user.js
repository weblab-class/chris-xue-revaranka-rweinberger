var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/app');


// TODO: Fill out the userSchema.
// Hint: a user is an object such as
//     {'username': 'Isaac', 'favoriteFruit': 'apple'}
var userSchema = new mongoose.Schema({
	name: {type: String, required: true, index: {unique: true}},
	venmo: {type: String, required: false, index: {unique: true}},
  	email: {type: String, required: true, index: {unique: true}},
  	password: {type: String, required: true}
});

var User = mongoose.model('User', userSchema);

module.exports = User;