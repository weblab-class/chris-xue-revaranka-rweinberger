var express = require('express');
var router = express.Router();

var passport = require('passport');

/* GET the User Model */
var User = require('../schemas/user');
var Item = require('../schemas/item');

/* GET signup page. */
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
  console.log('signed up');
  console.log(req.body);
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

router.post('/logout', function(req, res){
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
    var itemlist = [];
    items.forEach(function(item) {
      itemlist.push({itemname:item.itemname, price:item.price, description:item.description, user: item.user, id:item.id});
    });
    var bool = true;
    if(req.isAuthenticated()) {
      bool = true;
      var name_user = req.user.username;
      res.render('home', {boolean: bool, items: itemlist, name: name_user});
    } else {
      bool = false;
      res.render('home', {boolean: bool, items: itemlist});
    };
  });
});

/* receiving starred items */
router.post('/star', function (req, res, next) {
  var starred = req.body.id;
  console.log('user starred '+starred);
  var user = req.body.username;
  users.update(
    {username: user},
    {$push:{starred:starred}}
    );
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
    var name_user = req.user.username;
    res.render('newitem', {boolean: bool, name: name_user});
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
  res.render('uploadsuccess');
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
      userlist.push({name:user.name, venmo:user.venmo});
    });

    res.send(userlist);  
  });
});

/*search results*/
router.post('/searchresults', function(req, res) {
  term = req.body.term;
  Item.find({}, function(err, items) {
    var itemlist = new Set();
    items.forEach(function(item) {
      tags = item.tags;
      title = item.itemname;
      var exists = title.search(term);
      if (exists != -1) {
        itemlist.add(item)
      };
      for (i=0; i < tags.length; i++){
        if (tags[i] == term) {
          itemlist.add(item)
        };
      };
    });
    items = Array.from(itemlist);
    var bool = true;
    if(req.isAuthenticated()) {
      bool = true;
      var name_user = req.user.username;
      res.render('searchresults', {boolean: bool, term:term,items: items, name: name_user});
    } else {
      bool = false;
      res.render('searchresults', {boolean: bool, term:term, items: items});
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
    // res.send(items);
    var bool = true;
    if(req.isAuthenticated()) {
      bool = true;
      var name_user = req.user.username;
      res.render('home', {boolean: bool, items: items, name: name_user});
    } else {
      bool = false;
      res.render('home', {boolean: bool, items: items});
    };
  });
});

router.get('/books', function(req,res){
  Item.find({'category':'Books'}, function(err, items){
    // res.send(items);
    var bool = true;
    if(req.isAuthenticated()) {
      bool = true;
      var name_user = req.user.username;
      res.render('home', {boolean: bool, items: items, name: name_user});
    } else {
      bool = false;
      res.render('home', {boolean: bool, items: items});
    };
  });
});

router.get('/tech', function(req,res){
  Item.find({'category':'Tech'}, function(err, items){
    // res.send(items);
    var bool = true;
    if(req.isAuthenticated()) {
      bool = true;
      var name_user = req.user.username;
      res.render('home', {boolean: bool, items: items, name: name_user});
    } else {
      bool = false;
      res.render('home', {boolean: bool, items: items});
    };
  });
});

router.get('/furniture', function(req,res){
  Item.find({'category':'Furniture'}, function(err, items){
    // res.send(items);
    var bool = true;
    if(req.isAuthenticated()) {
      bool = true;
      var name_user = req.user.username;
      res.render('home', {boolean: bool, items: items, name: name_user});
    } else {
      bool = false;
      res.render('home', {boolean: bool, items: items});
    };
  });
});

module.exports = router;
