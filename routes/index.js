var express = require('express');
var router = express.Router();
var passport = require('passport');
var exphbs = require('express-handlebars');

/* GET the User Model */
var User = require('../schemas/user');
var Item = require('../schemas/item');

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
      var name = req.user.name;
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
          res.render('slashscreen', {boolean: bool, starItems: starredItems, otherItems:otherItems, name: name, username:username
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

router.get('/signup', function(req, res, next) {
  res.render('signup', {});
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: false })
    );

router.post('/signup', function (req, res, next) {

  var user = new User({name: req.body.name, venmo: req.body.venmo, username: req.body.username});
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

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
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
      var name = req.user.name;
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
          res.render('home', {boolean: bool, starItems: starredItems, otherItems:otherItems, name: name, username:username
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
    User.update({username:user},{$set:{starred:starredIds}}, function (err, raw) {
      if (err) return handleError(err);
      console.log('The raw response from Mongo was ', raw);
    });
  } else {
    console.log('unregistered user attempted to unstar ' + starred);
  };
});

router.get('/starreditems', function(req, res) {
  if(req.isAuthenticated()) {
    var bool = true;
    var starredIds = req.user.starred;
    var otherItems = [];
    var name = req.user.name;
    var username = req.user.username;
    Item.find({'_id': { $in: starredIds}}, function (err, starredItems) {
      if (err) {
        console.log('error');
        res.render('error')
      } else {
        bool = true;
        res.render('home', {boolean: bool, starItems: starredItems, otherItems:otherItems, name: name, username:username
        });
      }
    });
  } else {
    Item.find({}, function(err, items) {
      var bool = false;
      res.redirect('home', {boolean: bool, items: items})
    });
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
      var name = req.user.name;
      res.redirect('home', {boolean: bool, items: items, name: name});
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
    var name = req.user.name;
    res.render('newitem', {boolean: bool, name: name});
  } else {
    bool = false;
    res.redirect('/login');
  };
});

router.post('/uploaditem', function(req, res, next) {
  var itemname = req.body.itemname;
  var price = req.body.price;
  var description = req.body.description;
  var tags = req.body.tags;
  var category = req.body.category;
  var user = req.user.username;
  //console.log(tags);
  var newItem = new Item({
    'itemname': itemname,
    'price': price,
    'description': description,
    'tags':tags,
    'category':category,
    'user':user
  });
  newItem.save();
  res.send('/uploadsuccess');
});


router.get('/uploadsuccess', function(req, res) {
  if(req.isAuthenticated()) {
    bool = true;
    var name = req.user.name;
    res.render('uploadsuccess', {boolean: bool, name: name});
  } else {
    bool = false;
    res.redirect('/login');
  };
});


/* itemlist and userlist*/
router.get('/itemlist', function(req, res) {
  Item.find({}, function(err, items) {
    var itemlist = [];
    items.forEach(function(item) {
      itemlist.push({itemname:item.itemname, price:item.price, description:item.description, tags:item.tags, category:item.category, user: item.user});
    });

    res.send(itemlist);  
  });
});

router.get('/userlist', function(req, res) {
  User.find({}, function(err, users) {
    var userlist = [];
    users.forEach(function(user) {
      userlist.push({name:user.name, venmo:user.venmo, starred: user.starred});
    });

    res.send(userlist);  
  });
});

/*user profile page*/
router.get('/profile', function(req, res) {
  if(req.isAuthenticated()) {
    var email = req.user.username;
    var starredItemIds = req.user.starred;
    var otherItems = [];
    var starredItems = [];
    var name = req.user.name;
    var venmo = req.user.venmo;
    Item.find({'user':email}, function(err, items){
      var bool = true;
      for (var i=0; i<items.length; i++) {
        if (starredItemIds.indexOf(items[i].id) == -1) {
          otherItems.push(items[i]);
        } else {
          starredItems.push(items[i]);
        };
      };
      res.render('profile', {boolean:bool, name: name, email: email, venmo: venmo, starred: starredItems, unstarred: otherItems});
    });
  } else {
    bool = false;
    res.redirect('login');
  };
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
      var name = req.user.name;
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
      res.render('searchresults', {boolean: bool, term:term,starred: starredItems, unstarred: otherItems, name: name});
    } else {
      bool = false;
      res.render('searchresults', {boolean: bool, term:term, otherItems: items});
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
  Item.find({'category':'Clothes'}, function(err, items){
    if(req.isAuthenticated()) {
      var bool = true;
      var name = req.user.name;
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
          console.log(starredItems);
          console.log('starredItems is length ' + starredItems.length);
          var starredItemsCopy = starredItems.slice(0);
          for (i=0; i < starredItems.length; i++) {
            if (starredItems[i].category != 'Clothes') {
              console.log('splicing '+ starredItems[i].itemname + ' with category ' + starredItems[i].category);
              var copyIndex = starredItemsCopy.indexOf(starredItems[i]);
              starredItemsCopy.splice(copyIndex,1)
            } else {
              console.log(starredItems[i].itemname + ' with category ' + starredItems[i].category + ' is safe');
            };
          };
          console.log('starred: ' +starredItemIds);
          console.log('other: ' +otherItems);
          bool = true;
          res.render('home', {boolean: bool, starItems: starredItemsCopy, otherItems:otherItems, name: name, username:username
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

router.get('/books', function(req,res){
  Item.find({'category':'Books'}, function(err, items){
    if(req.isAuthenticated()) {
      var bool = true;
      var name = req.user.name;
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
          console.log(starredItems);
          console.log('starredItems is length ' + starredItems.length);
          var starredItemsCopy = starredItems.slice(0);
          for (i=0; i < starredItems.length; i++) {
            if (starredItems[i].category != 'Books') {
              console.log('splicing '+ starredItems[i].itemname + ' with category ' + starredItems[i].category);
              var copyIndex = starredItemsCopy.indexOf(starredItems[i]);
              starredItemsCopy.splice(copyIndex,1)
            } else {
              console.log(starredItems[i].itemname + ' with category ' + starredItems[i].category + ' is safe');
            };
          };
          console.log('starred: ' +starredItemIds);
          console.log('other: ' +otherItems);
          bool = true;
          res.render('home', {boolean: bool, starItems: starredItemsCopy, otherItems:otherItems, name: name, username:username
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

router.get('/tech', function(req,res){
  Item.find({'category':'Tech'}, function(err, items){
    if(req.isAuthenticated()) {
      var bool = true;
      var name = req.user.name;
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
          console.log(starredItems);
          console.log('starredItems is length ' + starredItems.length);
          var starredItemsCopy = starredItems.slice(0);
          for (i=0; i < starredItems.length; i++) {
            if (starredItems[i].category != 'Tech') {
              console.log('splicing '+ starredItems[i].itemname + ' with category ' + starredItems[i].category);
              var copyIndex = starredItemsCopy.indexOf(starredItems[i]);
              starredItemsCopy.splice(copyIndex,1)
            } else {
              console.log(starredItems[i].itemname + ' with category ' + starredItems[i].category + ' is safe');
            };
          };
          console.log('starred: ' +starredItemIds);
          console.log('other: ' +otherItems);
          bool = true;
          res.render('home', {boolean: bool, starItems: starredItemsCopy, otherItems:otherItems, name: name, username:username
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

router.get('/furniture', function(req,res){
  Item.find({'category':'Furniture'}, function(err, items){
    if(req.isAuthenticated()) {
      var bool = true;
      var name = req.user.name;
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
          console.log(starredItems);
          console.log('starredItems is length ' + starredItems.length);
          var starredItemsCopy = starredItems.slice(0);
          for (i=0; i < starredItems.length; i++) {
            if (starredItems[i].category != 'Furniture') {
              console.log('splicing '+ starredItems[i].itemname + ' with category ' + starredItems[i].category);
              var copyIndex = starredItemsCopy.indexOf(starredItems[i]);
              starredItemsCopy.splice(copyIndex,1)
            } else {
              console.log(starredItems[i].itemname + ' with category ' + starredItems[i].category + ' is safe');
            };
          };
          console.log('starred: ' +starredItemIds);
          console.log('other: ' +otherItems);
          bool = true;
          res.render('home', {boolean: bool, starItems: starredItemsCopy, otherItems:otherItems, name: name, username:username
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

module.exports = router;
