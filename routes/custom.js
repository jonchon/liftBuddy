const mongoose 		= require('mongoose');
const express 		= require('express');
const bodyParser 	= require('body-parser');
const User			= require('../models/user');
const router 		= express.Router();

router.use(bodyParser.urlencoded({ extended: true })); 

router.post('/', function (req, res) {
	if (req.session && req.session.userId) {
		User.findOne({email: req.session.email}, function(err, user) {
			user.custom.push(JSON.stringify(req.body));
			user.customOption.push([]);
			user.save(function(err, updatedUser) {
				if (err) return handleError(err);
				res.send(updatedUser);
			});
		});
	}
});

router.get('/', function (req, res) {
	if (req.session && req.session.userId) {
		User.findOne({email: req.session.email}, function (err, user) {
			res.send(user.custom);
		});
	}
});

router.put('/', function (req, res) {
	if (req.session && req.session.userId) {
		User.findOne({email: req.session.email}, function (err, user) {
			let ind = req.body.index;
			user.custom.splice(ind, 1);
			user.customOption.splice(ind, 1);
			user.save(function(err, updatedUser) {
				if (err) return handleError(err);
				res.send(updatedUser);
			});
		});
	}
});

module.exports = router;