var mongoose = require('mongoose');

// TODO: Fill out the userSchema.
// Hint: a user is an object such as
//     {'username': 'Isaac', 'favoriteFruit': 'apple'}
var chatSchema = new mongoose.Schema({
  users: {type: Array, required: true},
  messages: {type: Array, required: false},  
}, {collection: 'chats'});

var chat = mongoose.model('Chat', chatSchema);

module.exports = chat;