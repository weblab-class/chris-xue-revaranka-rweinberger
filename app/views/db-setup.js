var mongo = require('mongodb').MongoClient;
var dbConnectionUrl = 'mongodb://localhost:27017/app';

var collections = {};

mongo.connect(dbConnectionUrl, function (err, db) {
  if (err) {
    console.log('Can not connect to MongoDB. Did you run it?');
    console.log(err.message);
    return;
  }

  collections.users = db.collection('users');
  collections.items = db.collection('items');

});


module.exports = collections;
