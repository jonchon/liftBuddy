//log in an create user code based off of https://github.com/Createdd/authenticationIntro
const mongoose	 	= require('mongoose');
const express 		= require('express');
const bodyParser 	= require('body-parser');
const User 			= require('../models/user');
const router 		= express.Router();

router.use(bodyParser.urlencoded({ extended: true })); 

router.get('/', function(req, res) {
	res.render('create_user');
})

router.post('/', async (req, res, next) => {
	if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
		let userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf,
		}
		//verify that password & passwordConf matches
		if (req.body.password !== req.body.passwordConf) {
			let err 	= new Error('Passwords do not match');
			err.status 	= 400;
			res.render('create_user', { error: "Passwords do not match" });
			return next(err);
		}
		else {
			User.create(userData, function (err, user) {
				if (err) {
					/*
					let err = new Error(`${req.body.email} already exists`);
					err.status = 400;
					*/
					res.render('create_user', {error: `${req.body.email} already exists`});
					//return next(err)
				}
				else {
					req.session.userId 	= user._id;
					req.session.email 	= req.body.email;
					return res.redirect('/');
				}
			});
		}
	}
	else {
		/*
		let err = new Error('All fields required');
		err.status = 400;
		*/
		res.render('create_user', {error: "All fields required"});
		//return next(err);
	}
})

module.exports = router;