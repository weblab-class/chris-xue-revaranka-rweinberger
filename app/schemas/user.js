var mongoose = require('mongoose');
// mongoose.createConnection('mongodb://localhost/app');

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

var User = new Schema({name: String, venmo: String});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);