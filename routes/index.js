var express = require('express');
var router = express.Router();
var passport = require('passport');
var exphbs = require('express-handlebars');
var multer = require('multer');
var mime = require('mime');
var crypto = require('crypto');
var Grid = require('gridfs-stream');
var mongo = require('mongodb');
var GridFsStorage = require('multer-gridfs-storage');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var nodemailer = require('nodemailer');
var flash = require('express-flash');

/* GET the User Model */
var User = require('../schemas/user');
var Item = require('../schemas/item');
var Chat = require('../schemas/chat');

/*sending user data as JSON to access on client side*/
router.get('/api/user_data', function(req, res) {
  if (req.user === undefined) {
    // The user is not logged in
    res.json({});
  } else {
    res.json({
      username: req.user.username,
      firstname: req.user.firstname
    });
  }
});

/*socket*/


router.get('/general-chat', function(req, res){
  res.render('general-chat.hbs');
});

router.post('/startchat', function (req, res, next) {
  var target = req.body.targetUser;
  var selecting = req.body.selectingUser;
  var users1 = [selecting,target];
  var users2 = [target,selecting];
  console.log(users1);
  Chat.findOne({users:users1}, function(err, result) {
    if (err) { /* handle err */
      console.log('error1')
    } if (result) {
      console.log('ERROR: '+selecting+' attempted to start an existing conversation - 1')
    } else {
      Chat.findOne({users:users2}, function(err, result) {
        if (err) {
          console.log('error2')
        } if (result) {
          console.log('ERROR: '+selecting+' attempted to start an existing conversation - 2')
        } else {
          var newChat = new Chat({
            'users': users1
          });
          newChat.save(function(err,chat) {
            id = chat.id;
            console.log("chat " +id+" successfully initiated");
            User.update({username:selecting},{$push:{conversations:id}}, function (err, raw) {
              if (err) return handleError(err);
              console.log('The raw response for selecting was ', raw);
              User.update({username:target},{$push:{conversations:id}}, function (err, raw) {
                if (err) return handleError(err);
                console.log('The raw response for target was ', raw);
                res.send('/chat/'+id)
              });
            });
          });
        };
      });
    };
  });
});

router.get('/chat', function(req, res){
  if(req.isAuthenticated()) {
    var user = req.user.username;
    var conversations = req.user.conversations;
    var existing_users_set = new Set();
    var new_users = [];
    User.find({}, function(err, users) {
      //for each convo ID of current user
      for (i=0; i < conversations.length; i++) {
        //for each user in userlist
        for (j=0; j < users.length; j++) {
          // get that user's convo IDs
          var userConvos = users[j].conversations;
          // if that user shares the current convo ID
          if (userConvos.indexOf(conversations[i]) != -1) {
            // put them in the list of already-initiated convo users
            console.log("existing user found: "+users[j].username)
            users[j].chatid = conversations[i];
            existing_users_set.add(users[j]);
          }
        }
      }
      var existing_users = Array.from(existing_users_set);
      if (existing_users.indexOf())
      for (i=0; i < users.length; i++) {
        if (existing_users.indexOf(users[i]) === -1) {
          new_users.push(users[i])
        }
      }
      for (i=0; i < existing_users.length; i++) {
        if (existing_users[i].username == user) {
          existing_users.splice(i, 1);
        };
      };
      for (i=0; i < new_users.length; i++) {
        if (new_users[i].username == user) {
          new_users.splice(i, 1);
        };
      };
      // var new_users = Array.from(new_users_set);
      res.render('chat_home.hbs', {selected_chat: false, new_users: new_users, existing_users: existing_users});
      // res.render('newconvo.hbs', {new_users: new_users, existing_users: existing_users});
    });
  } else {
    res.render('please-login', {inorderto: 'access your conversations!'});
  };
});


router.get('/chat/:id', function(req, res){
  if(req.isAuthenticated()) {
    var id = req.params.id;
    var user = req.user.username;
    var conversations = req.user.conversations;
    var existing_users_set = new Set();
    var new_users = [];
    User.find({}, function(err, users) {
      //for each convo ID of current user
      for (i=0; i < conversations.length; i++) {
        //for each user in userlist
        for (j=0; j < users.length; j++) {
          // get that user's convo IDs
          var userConvos = users[j].conversations;
          // if that user shares the current convo ID
          if (userConvos.indexOf(conversations[i]) != -1) {
            // put them in the list of already-initiated convo users
            console.log("existing user found: "+users[j].username)
            users[j].chatid = conversations[i];
            existing_users_set.add(users[j]);
          }
        }
      }
      var existing_users = Array.from(existing_users_set);
      if (existing_users.indexOf())
      for (i=0; i < users.length; i++) {
        if (existing_users.indexOf(users[i]) === -1) {
          new_users.push(users[i])
        }
      }
      for (i=0; i < existing_users.length; i++) {
        if (existing_users[i].username == user) {
          existing_users.splice(i, 1);
        };
      };
      for (i=0; i < new_users.length; i++) {
        if (new_users[i].username == user) {
          new_users.splice(i, 1);
        };
      };
      if (conversations.indexOf(id) != -1) {
        Chat.findOne({'_id':id}, function(err, chat) {
          if (err) {
            console.log('error retrieving chat')
          } else {
            var messages = chat.messages;
            res.render('chat_home.hbs', {selected_chat: true, users:chat.users, chatid: id, existing_messages: messages, new_users: new_users, existing_users: existing_users})
          }
        })
      } else {
        res.send('you do not have access to this conversation!! go away')
      };
      // var new_users = Array.from(new_users_set);
      // res.render('chat_home.hbs', {selected_chat: false, new_users: new_users, existing_users: existing_users});
      // res.render('newconvo.hbs', {new_users: new_users, existing_users: existing_users});
    });
  } else {
    res.render('please-login', {inorderto: 'access your conversations!'});
  };
});

// router.get('/chat/:id', function(req, res) {
//   if(req.isAuthenticated()) {
//     var user = req.user.username;
//     var id = req.params.id;
//     var userConvos = req.user.conversations;
//     if (userConvos.indexOf(id) != -1) {
//       Chat.findOne({'_id':id}, function(err, chat) {
//         if (err) {
//           console.log('error retrieving chat')
//         } else {
//           var messages = chat.messages;
//           res.render('chat_home.hbs', {selected_chat: true, users:chat.users, chatid: id, existing_messages: messages})
//         }
//       })
//     } else {
//       res.send('you do not have access to this conversation!! go away')
//     } 
//   } else {
//     res.render('please-login', {inorderto: 'access your conversations!'});
//   };
// });

router.post('/message', function (req, res, next) {
  var chatid = req.body.chatid;
  var message = req.body.message;
  var sender = req.body.sender;
  var newMessage = {sender: sender, message:message};
  Chat.update({'_id':chatid},{$push:{messages:newMessage}}, function (err, raw) {
    if (err) return handleError(err);
    console.log('The raw response from Mongo was ', raw);
  });
});

/* IGNORE 
var newItem = new Item({
  'itemname': itemname,
  'price': price,
  'description': description,
  'tags':tags,
  'category':category,
  'user':user,
  'firstname':firstname,
  'lastname':lastname,
  'userid': userid,
  'picture': picture
});
newItem.save();
res.redirect('/uploadsuccess');
*/


// mongodb://heroku_vjphwnnq:psa8d92epggk9s8acu3ipfel2n@ds127429.mlab.com:27429/heroku_vjphwnnq

mongo.connect('mongodb://heroku_vjphwnnq:psa8d92epggk9s8acu3ipfel2n@ds127429.mlab.com:27429/heroku_vjphwnnq', function(err, db) {
    var gfs = Grid(db, mongo);
    var storage = GridFsStorage({
        gfs: gfs,
       filename: function(req, file, cb) {
           crypto.randomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
           });
         }
  });
       
  var upload = multer({ storage: storage });

  router.post('/uploaditem', upload.single('picture'), function(req, res, next) {
    var itemname = req.body.itemname;
    var price = req.body.price;
    var description = req.body.description;
    var tags = req.body.tags;
    var category = req.body.category;
    var user = req.user.username;
    var userid = req.user.id;
    var firstname = req.user.firstname;
    var lastname = req.user.lastname;
    var picture = '';
    if(req.file) {
      picture = req.file.filename;
    }
    //console.log(tags);
    console.log(req.file);
    var newItem = new Item({
      'itemname': itemname,
      'price': price,
      'description': description,
      'tags':tags,
      'category':category,
      'user':user,
      'firstname':firstname,
      'lastname':lastname,
      'userid': userid,
      'picture': picture
    });
    newItem.save();
    res.redirect('/uploadsuccess');
  });

  router.post('/uploadpic', upload.single('profpic'), function(req, res, next){
   if (req.isAuthenticated()){
      User.update({username:req.user.username},{$set:{picture:req.file.filename}}, function(err, raw){
        if (err){ 
          return handleError(err);
        }
      })
      res.redirect('/profile')
   }
  })
  
  router.post('/signup', upload.single('picture'), function (req, res, next) {
    var file = req.file.filename;
    console.log('signed up');
    console.log(file);
    var user = new User({picture: file, firstname: req.body.firstname, lastname: req.body.lastname, venmo: req.body.venmo, username: req.body.username});
    User.register(user, req.body.password, function(registrationError) {
      if(!registrationError) {
        req.login(user, function(loginError)
         {
          if (loginError) { return next(loginError); }
          return res.redirect('/home');
        });
      } else {
        res.send(registrationError);
      }
  });
});
router.post('/updateprofile',upload.single('picture'), function(req, res,next){
  if(req.isAuthenticated()){
    User.update({username:req.user.username}, {$set:{firstname:req.body.firstname, picture:req.file.filename, firstname:req.body.firstname, lastname: req.body.lastname, venmo: req.body.venmo}}, function(err,raw){
        if (err){
          return handleError(error);
        }
    })
    
  //  User.findOne({'username': req.user.username}, function(err, user){
  //    user.setPassword(req.body.newpassword, function(err){})

    //})
    res.redirect('/');


  }
});



  router.get('/uploads/:filename', function(req, res) {
  // TODO: set proper mime type + filename, handle errors, etc...
  var filename = req.params.filename;
  mongo.GridStore.exist(db, filename, function(err, exists){
    if(exists) {
            gfs
        // create a read stream from gfs...
        .createReadStream({ filename: filename })
        // and pipe it to Express' response
        .pipe(res);

      } else {
        res.status(404).send();
      }
  })
    });

});


//helper fn for starring items
// var hbs = exphbs.create({
//     // Specify helpers which are only registered on this instance. 
//     helpers: {
//       starred: function (id, username) {
//         console.log('doing starred function');
//         User.findOne({ 'username': username }, 'starred', function (err, user) {
//           var starred = user.starred;
//           if (err) return handleError(err);
//           if (starred.indexOf(id) != -1) {
//             return "&#9733;"
//           } else {
//             return "&#9734;"
//           };
//         });
//       }
//     }
// });

// router.get('/', function(req, res, next) {
//   res.render('index')
// });

/* GET signup page. */
router.get('/', function(req, res, next) {

  Item.find({}, function(err, items) {
    if(req.isAuthenticated()) {
      var bool = true;
      var firstname = req.user.firstname;
      var username = req.user.username;
      var starredItemIds = req.user.starred;
      var otherItems = [];
      for (var i = 0; i < items.length; i++) {
        if (starredItemIds.indexOf(items[i].id) == -1) {
          otherItems.push(items[i]);
        };
      };
      Item.find({'_id': { $in: starredItemIds}}, function (err, starredItems) {
        if (err) {
          console.log('error getting starred item');
          res.render('error')
        } else {
          console.log('starred: ' +starredItemIds);
          console.log('other: ' +otherItems);
          bool = true;
          res.render('slashscreen', {boolean: bool, starItems: starredItems, otherItems:otherItems, firstname: firstname, username:username
          });
        }
      });
    } else {
      var bool = false;
      res.render('slashscreen', {boolean: bool, otherItems: items, helpers: {
        starred: function () {
          console.log('doing starred function for unregistered user');
          return "&#9734;"
          }
        }
      });
    };
});
});


router.get('/login', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.render('login', {});
  }
});


router.post('/login',
    passport.authenticate('local', { successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: false })
    );



router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ 'username': req.body.recoveremail }, function(err, user) {
        if (!user) {
          //req.flash('error', 'No account with that email address exists.');
          res.send('That email does not exist!  Please try again.');
        }
        else{

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });}
      });

    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('smtps://beaverplus@yahoo.com:dank6148@smtp.mail.yahoo.com');
      var mailOptions = {
        to: user.username,
        from: 'beaverplus@yahoo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        //console.flash('info', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user,
      token: req.params.token
    });
  });
});

router.post('/reset/:token', function(req, res) {

    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('back');
    }
    user.setPassword(req.body.password, function(err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      user.save(function(err) {
        req.logIn(user, function(err) {
          res.redirect('/');
        });
      });
    });

  });
});


// router.post('/', function(req, res, next) {
  // res.render('index', {title: 'Login'});

  // var email = req.query.email;

 //   User.findOne({'username': username}, function(err, user) {
 //     if (err) {
 //         res.send('An error occurred!');
 //     } else {
 //         if (user) {
 //           res.redirect('/home');
 //         } else {
 //        // If the user does not exist, use this line of code below.
 //         reqes.send('Please sign-up!' + username + 'is not a user');
 //         }
 //       }
    
 //   });
/* GET home page. */

router.get('/home', function (req, res, next) {
  Item.find({}, function(err, items) {
    if(req.isAuthenticated()) {
      var bool = true;
      var firstname = req.user.firstname;
      var username = req.user.username;
      var starredItemIds = req.user.starred;
      var otherItems = [];
      for (var i = 0; i < items.length; i++) {
        if (starredItemIds.indexOf(items[i].id) == -1) {
          otherItems.push(items[i]);
        };
      };
      Item.find({'_id': { $in: starredItemIds}}, function (err, starredItems) {
        if (err) {
          console.log('error getting starred item');
          res.render('error')
        } else {
          console.log('starred: ' +starredItemIds);
          console.log('other: ' +otherItems);
          bool = true;
          res.render('home', {boolean: bool, starItems: starredItems, otherItems:otherItems, firstname: firstname, username:username
          });
        }
      });
    } else {
      var bool = false;
      res.render('home', {boolean: bool, otherItems: items, helpers: {
        starred: function () {
          console.log('doing starred function for unregistered user');
          return "&#9734;"
          }
        }
      });
    };
  });
});

// FUCKING rip
// starred: function (id, username) {
//   console.log('doing starred function');
//   returnStar = "gg";
//   function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve,ms));
//   };
//   User.findOne({ 'username': username }, function (err, user) {
//     console.log(user);
//     var starred = user.starred;
//     console.log(starred);
//     if (starred.indexOf(id) != -1) {
//       console.log('returning filled');
//       returnStar = "&#9733;"
//     } else {
//       console.log('returning blank');
//       returnStar =  "&#9734;"
//     };
//   });
//   while (returnStar =='gg') {
//     sleep(100)
//   };
//   console.log(returnStar);
//   console.log('hopefully returning');
//   return returnStar

/* receiving starred items */

router.post('/star', function (req, res, next) {
  var starred = req.body.id;
  if(req.isAuthenticated()) {
    var user = req.user.username;
    console.log(user);
    if (req.user.starred.indexOf(starred) == -1) {
      User.update({username:user},{$push:{starred:starred}}, function (err, raw) {
        if (err) return handleError(err);
        console.log('The raw response from Mongo was ', raw);
      });
    };
  } else {
    console.log('unregistered user attempted to star ' + starred);
  };
});

router.post('/unstar', function (req, res, next) {
  var unstarred = req.body.id;
  if(req.isAuthenticated()) {
    var user = req.user.username;
    var starredIds = req.user.starred;
    var index = starredIds.indexOf(unstarred);
    starredIds.splice(index, 1);
    console.log(user);
    console.log(index);
    console.log(starredIds);
    f
  } else {
    console.log('unregistered user attempted to unstar ' + starred);
  };
});

router.get('/starreditems', function(req, res) {
  if(req.isAuthenticated()) {
    var bool = true;
    var starredIds = req.user.starred;
    var otherItems = [];
    var firstname = req.user.firstname;
    var username = req.user.username;
    Item.find({'_id': { $in: starredIds}}, function (err, starredItems) {
      if (err) {
        console.log('error');
        res.render('error')
      } else {
        bool = true;
        res.render('starred', {boolean:bool, starred: starredItems, firstname: firstname});
      }
    });
  } else {
    res.redirect('/')
  };
});

/*resorting items THIS DOESN'T WORK YET*/ 
router.post('/sort', function (req, res, next) {
  var sort = req.body.sort;
  if (sort == "dateNO") {
    Item.find({}, function(err, items) {
    console.log(sort);
    items.reverse();
    if(req.isAuthenticated()) {
      bool = true;
      var firstname = req.user.firstname;
      res.redirect('home', {boolean: bool, items: items, firstname: firstname});
    } else {
      bool = false;
      res.redirect('home', {boolean: bool, items: items});
    };
  });
  } else {
    console.log('something else')
  };
  // console.log(sort);
  // User.update({username:user},{$push:{starred:starred}});
});


// router.post('/adduser', function(req, res, next) {
// 	var name = req.body.name;
// 	var venmo = req.body.venmo;
// 	var email = req.body.email;
// 	var password = req.body.password;

// 	var newUser = new User({
// 		'name': name,
// 		'venmo': venmo,
// 		'email': email,
// 		'password': password
// 	});
//   newUser.save();
// 	res.redirect('/home');
// });

/* add a new item*/
router.get('/newitem', function(req, res) {
  var bool = true;
  if(req.isAuthenticated()) {
    bool = true;
    var firstname = req.user.firstname;
    res.render('newitem', {boolean: bool, firstname: firstname});
  } else {
    bool = false;
    res.redirect('/');
  };
});



router.get('/uploadsuccess', function(req, res) {
  if(req.isAuthenticated()) {
    bool = true;
    var firstname = req.user.firstname;
    res.render('uploadsuccess', {boolean: bool, firstname: firstname});
  } else {
    bool = false;
    res.redirect('/');
  };
});


/* itemlist and userlist*/
router.get('/itemlist', function(req, res) {
  Item.find({}, function(err, items) {
    var itemlist = [];
    items.forEach(function(item) {
      itemlist.push({itemname:item.itemname, price:item.price, description:item.description, tags:item.tags, category:item.category, user: item.user, firstname: item.firstname, lastname: item.lastname});
    });

    res.send(itemlist);  
  });
});

router.get('/userlist', function(req, res) {
  User.find({}, function(err, users) {
    res.render('userlist', {users:users});  
  });
});

/*user profile page*/
router.get('/profile', function(req, res) {
  if(req.isAuthenticated()) {
    var email = req.user.username;
    var starredItemIds = req.user.starred;
    var otherItems = [];
    var starredItems = [];
    var firstname = req.user.firstname;
    var lastname = req.user.lastname;
    var venmo = req.user.venmo;
    var profpic = req.user.picture
    var access = true;
    Item.find({'user':email}, function(err, items){
      var bool = true;
      for (var i=0; i<items.length; i++) {
        if (starredItemIds.indexOf(items[i].id) == -1) {
          otherItems.push(items[i]);
        } else {
          starredItems.push(items[i]);
        };
      };
      res.render('profile', {access: access, profpic: profpic, boolean:bool, firstname: firstname, profilefirstname: firstname, profilelastname:lastname, email: email, venmo: venmo, starred: starredItems, unstarred: otherItems});
    });
  } else {
    bool = false;
    res.redirect('/');
  };
});

router.get('/profile/:id', function(req, res, next) {  
  var id = req.params.id;
  User.findOne({ '_id': id }, function (err, user) {
    if (err) return handleError(err);
    console.log('found user ' + user.firstname +' ' +user.lastname);
    var email = user.username;
    var starredItemIds = user.starred;
    var otherItems = [];
    var starredItems = [];
    var profilefirstname = user.firstname;
    var profilelastname = user.lastname;
    var venmo = user.venmo;
    var profpic = user.picture;
    var access= false;
    if(req.isAuthenticated()) {
      var firstname = req.user.firstname;
      if (id == req.user.id){
        access= true;
      }
      Item.find({'user':email}, function(err, items){
        var bool = true;
        for (var i=0; i<items.length; i++) {
          if (starredItemIds.indexOf(items[i].id) == -1) {
            otherItems.push(items[i]);
          } else {
            starredItems.push(items[i]);
          };
        };
        res.render('profile', {access: access, profpic: profpic, boolean:bool, firstname: firstname, profilefirstname: profilefirstname, profilelastname:profilelastname, email: email, venmo: venmo, starred: starredItems, unstarred: otherItems});
      });
    } else {
      bool = false;
      Item.find({'user':email}, function(err, items){
        res.render('profile', {profpic:profpic, access: access, boolean:bool, profilefirstname: profilefirstname, profilelastname:profilelastname, email: email, venmo: venmo, unstarred: items});
      });
    };
  })
});

/*manage items page*/
router.get('/manageitems', function(req, res) {
  if(req.isAuthenticated()) {
    var user = req.user.username;
    var bool = true;
    var firstname = req.user.firstname;
    Item.find({'user':user}, function(err, items) {
      res.render('manageitems', {boolean:bool, firstname: firstname, items:items, user:user});
    });
  } else {
    res.redirect('/');
  };
});


router.post('/deleteitem', function(req, res) {
  var user = req.user.username;
  var bool = true;
  var firstname = req.user.firstname;
  var deleteItemId = req.body.itemid;
  Item.remove({ _id: deleteItemId }, function(err, raw) {
    if (!err) {
      console.log(deleteItemId);
      // console.log('The raw response from Mongo was ', raw);
      res.render('deletesuccess', {boolean:bool, firstname: firstname});
    } else {
      console.log('error deleting item');
    }
  });
});

/*search results*/
router.post('/searchresults', function(req, res) {
  term = req.body.term.toLowerCase();
  Item.find({}, function(err, items) {
    var itemlist = new Set();
    items.forEach(function(item) {
      var tags = item.tags;
      var title = item.itemname.toLowerCase();
      var description = item.description.toLowerCase();
      var existsTitle = title.search(term);
      var existsDes = description.search(term);
      if (existsTitle != -1) {
        itemlist.add(item)
      };
      if (existsDes != -1) {
        itemlist.add(item)
      };
      for (i=0; i < tags.length; i++){
        if (tags[i] == term) {
          itemlist.add(item)
        };
      };
      if (item.category.toLowerCase() == term) {
        itemlist.add(item)
      };
    });
    items = Array.from(itemlist);
    var bool = true;
    if(req.isAuthenticated()) {
      bool = true;
      var firstname = req.user.firstname;
      var starredItemIds = req.user.starred;
      var otherItems = [];
      var starredItems = [];
      for (var i=0; i<items.length; i++) {
        if (starredItemIds.indexOf(items[i].id) == -1) {
          otherItems.push(items[i]);
        } else {
          starredItems.push(items[i]);
        };
      };
      res.render('searchresults', {boolean: bool, term:term,starred: starredItems, unstarred: otherItems, firstname: firstname});
    } else {
      bool = false;
      res.render('searchresults', {boolean: bool, term:term, unstarred: items});
    };
  });
});

//CATEGORIES//
// router.get('/tech', function(req,res){
//   Item.find({'category':'Tech'}, function(err, items){
//     res.send(items);
//   });
// });

// router.get('/furniture', function(req,res){
//   Item.find({'category':'Furniture'}, function(err, items){
//     res.send(items);
//   });
// });



// router.get('/books', function(req,res){
//   Item.find({'category':'Books'}, function(err, items){
//     res.send(items);
//   });
// });

router.get('/clothes', function(req,res){
  Item.find({'category':'clothes'}, function(err, items){
    if(req.isAuthenticated()) {
      var bool = true;
      var firstname = req.user.firstname;
      var username = req.user.username;
      var starredItemIds = req.user.starred;
      var otherItems = [];
      var starredItems = [];
      for (var i = 0; i < items.length; i++) {
        if (starredItemIds.indexOf(items[i].id) == -1) {
          otherItems.push(items[i]);
        } else {
          starredItems.push(items[i])
        };
      };
      res.render('home', {boolean: bool, starItems: starredItems, otherItems:otherItems, firstname: firstname, username:username
      });
    } else {
      var bool = false;
      res.render('home', {boolean: bool, otherItems: items, helpers: {
        starred: function () {
          console.log('doing starred function for unregistered user');
          return "&#9734;"
          }
        }
      });
    };
  });
});

router.get('/books', function(req,res){
  Item.find({'category':'books'}, function(err, items){
    if(req.isAuthenticated()) {
      var bool = true;
      var firstname = req.user.firstname;
      var username = req.user.username;
      var starredItemIds = req.user.starred;
      var otherItems = [];
      var starredItems = [];
      for (var i = 0; i < items.length; i++) {
        if (starredItemIds.indexOf(items[i].id) == -1) {
          otherItems.push(items[i]);
        } else {
          starredItems.push(items[i])
        };
      };
      res.render('home', {boolean: bool, starItems: starredItems, otherItems:otherItems, firstname: firstname, username:username
      });
    } else {
      var bool = false;
      res.render('home', {boolean: bool, otherItems: items, helpers: {
        starred: function () {
          console.log('doing starred function for unregistered user');
          return "&#9734;"
          }
        }
      });
    };
  });
});

router.get('/tech', function(req,res){
  Item.find({'category':'tech'}, function(err, items){
    if(req.isAuthenticated()) {
      var bool = true;
      var firstname = req.user.firstname;
      var username = req.user.username;
      var starredItemIds = req.user.starred;
      var otherItems = [];
      var starredItems = [];
      for (var i = 0; i < items.length; i++) {
        if (starredItemIds.indexOf(items[i].id) == -1) {
          otherItems.push(items[i]);
        } else {
          starredItems.push(items[i])
        };
      };
      res.render('home', {boolean: bool, starItems: starredItems, otherItems:otherItems, firstname: firstname, username:username
      });
    } else {
      var bool = false;
      res.render('home', {boolean: bool, otherItems: items, helpers: {
        starred: function () {
          console.log('doing starred function for unregistered user');
          return "&#9734;"
          }
        }
      });
    };
  });
});

router.get('/furniture', function(req,res){
  Item.find({'category':'furniture'}, function(err, items){
    if(req.isAuthenticated()) {
      var bool = true;
      var firstname = req.user.firstname;
      var username = req.user.username;
      var starredItemIds = req.user.starred;
      var otherItems = [];
      var starredItems = [];
      for (var i = 0; i < items.length; i++) {
        if (starredItemIds.indexOf(items[i].id) == -1) {
          otherItems.push(items[i]);
        } else {
          starredItems.push(items[i])
        };
      };
      res.render('home', {boolean: bool, starItems: starredItems, otherItems:otherItems, firstname: firstname, username:username
      });
    } else {
      var bool = false;
      res.render('home', {boolean: bool, otherItems: items, helpers: {
        starred: function () {
          console.log('doing starred function for unregistered user');
          return "&#9734;"
          }
        }
      });
    };
  });
});


module.exports = router;
