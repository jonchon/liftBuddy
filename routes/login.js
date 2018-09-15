const mongoose 		= require('mongoose');
const express 		= require('express');
const bodyParser 	= require('body-parser');
const User			= require('../models/user');
const router 		= express.Router();

router.use(bodyParser.urlencoded({ extended: true })); 

router.get('/', function(req, res) {
	res.render('login')
})

router.post('/', async function(req, res, next) {
	if(req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, function (error, user) {
			if (error || !user) {
				/*
				let err = new Error('Wrong email or password');
				err.status = 401;
				*/
				res.render('login', { error: 'Wrong email or password' });
				//return next(error);
			}
			else {
				req.session.userId 	= user._id;
				req.session.email	= req.body.email;
				return res.redirect('/');
			}
		});
	}
	else {
		/*
		let err = new Error('All fields are required');
		err.status = 400;
		*/
		res.render('login', { error: "All fields are required"});
		//return next(err);
	}
})

module.exports = router;