const mongoose 		= require('mongoose');
const express 		= require('express');
const bodyParser 	= require('body-parser');
const User			= require('../models/user');
const router 		= express.Router();

router.use(bodyParser.urlencoded({ extended: true })); 

router.get('/', function (req, res) {
	User.findOne({email: req.session.email}, function (err, user) {
		res.send(user.customOption);
	});
});

router.put('/', function (req, res) {
	User.findOne({email: req.session.email}, function (err, user) {
		let ind = req.body.index;
		delete req.body.index;
		user.customOption[ind].push(JSON.stringify(req.body));
		user.markModified('customOption');
		user.save(function(err, updatedUser) {
			if (err) return handleError(err);
			res.send(updatedUser);
		});
	});
});

module.exports = router;