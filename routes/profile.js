const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/user');
const profile = require('../routes/profile');
const router = express.Router();


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