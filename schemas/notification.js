var mongoose = require('mongoose');

// TODO: Fill out the userSchema.
// Hint: a user is an object such as
//     {'username': 'Isaac', 'favoriteFruit': 'apple'}
var notifSchema = new mongoose.Schema({
  toWho: {type: String, required: true},
  fromWho: {type: String, required: true},  
}, {collection: 'notifications'});

var notification = mongoose.model('Notification', notifSchema);

module.exports = notification;