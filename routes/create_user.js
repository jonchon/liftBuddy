//move this to createUser.js and make only username and password for this one
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true })); 

const User = mongoose.model('User', new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	passwordConf: {
		type: String,
		required: true,
	}
}));

router.get('/', function(req, res) {
	res.render('create_user');
})

router.post('/', async (req, res, next) => {
	if (req.body.password !== req.body.passwordConf) {
		let err = new Error('Passwords do not match');
		err.status = 400;
		res.render('create_user', { error: "Passwords do not match"});
		return next(err);
	}

	if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
		let userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf,
		}
		User.create(userData, function (err, user) {
			if (err) {
				let err = new Error('Email already exists');
				err.status = 400;
				res.render('create_user', {error: "Email already exists"});
				return next(err)
			}
			else {
				return res.redirect('/profile');
			}
		});
	}
	else {
		let err = new Error('All fields required');
		err.status = 400;
		return next(err);
	}
})

router.get('/profile', function (req, res, next) {
	User.findById(req.session.userId)
		.exec(function (error, user) {
			if (error) {
				return next(error);
			}
			else {
				if (user === null) {
					let err = new Error ('Not Authorized');
					err.status = 400;
					return next(err);
				}
				else {
					return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email)
				}
			}
		});
});

module.exports = router;