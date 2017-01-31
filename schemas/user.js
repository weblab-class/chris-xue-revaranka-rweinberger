var mongoose = require('mongoose');

// // TODO: Fill out the userSchema.
// // Hint: a user is an object such as
// //     {'username': 'Isaac', 'favoriteFruit': 'apple'}
// var userSchema = new mongoose.Schema({
// 	name: {type: String, required: true, index: {unique: true}},
// 	venmo: {type: String, required: false, index: {unique: true}},
//   	email: {type: String, required: true, index: {unique: true}},
//   	password: {type: String, required: true}
// }, {collection: 'users'});

// var User = mongoose.model('User', userSchema);

// module.exports = User;
var Schema = mongoose.Schema,
passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({firstname: String, lastname: String, venmo: String, starred: Array, picture: String,conversations: Array, resetPasswordToken: String,
  resetPasswordExpires: Date, aboutme: String, real:false});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);