var express = require('express');
var router = express.Router();

/* GET the User Model */
var User = require('../schemas/user');
var Item = require('../schemas/item');

/* GET signup page. */
router.post('/adduser', function(req, res, next) {
	var name = req.body.name;
	var venmo = req.body.venmo;
	var email = req.body.email;
	var password = req.body.password;

	var newUser = new User({
		'name': name,
		'venmo': venmo,
		'email': email,
		'password': password
	});
  newUser.save();
	res.redirect('/home');
});

/* add a new item*/
router.get('/newitem', function(req, res) {
  res.render('newitem');
});

router.post('/uploaditem', function(req, res, next) {
  var itemname = req.body.itemname;
  var price = req.body.price;
  var description = req.body.description;

  var newItem = new Item({
    'itemname': itemname,
    'price': price,
    'description': description
  });
  newItem.save();
  res.redirect('/uploadsuccess');
});

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.get('/uploadsuccess', function(req, res) {
  res.render('uploadsuccess');
});


/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// router.post('/', function(req, res, next) {
	// res.render('index', {title: 'Login'});

	// var email = req.query.email;

 //  	User.findOne({'username': username}, function(err, user) {
 //    	if (err) {
 //      		res.send('An error occurred!');
 //    	} else {
 //     		if (user) {
 //     			res.redirect('/home');
 //      		} else {
 //        // If the user does not exist, use this line of code below.
 //        	reqes.send('Please sign-up!' + username + 'is not a user');
 //      		}
 //      	}
   	
 //  	});

/* GET home page. */

router.get('/home', function (req, res, next) {
  Item.find({}, function(err, items) {
    var itemlist = [];
    items.forEach(function(item) {
      itemlist.push({itemname:item.itemname, price:item.price, description:item.description});
    });
    res.render('home', {item:itemlist});
    console.log('hi')
  });
});

/* get list of all items in db*/
router.get('/itemlist', function(req, res) {
  Item.find({}, function(err, items) {
    var itemlist = [];
    items.forEach(function(item) {
      itemlist.push({itemname:item.itemname, price:item.price, description:item.description});
    });

    res.send(itemlist);  
  });
});


module.exports = router;
