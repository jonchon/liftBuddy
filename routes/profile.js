const mongoose 		= require('mongoose');
const express 		= require('express');
const User 			= require('../models/user');
const router 		= express.Router();


router.get('/', function (req, res, next) {
	User.findById(req.session.userId)
		.exec(function (error, user) {
			if (error) {
				res.render('profile', { error: "Problem getting profile" });
				return next(error);
			}
			else {
				if (user === null) {
					let err = new Error ( 'Not Authorized');
					err.status = 400;
					res.render('profile', { error: "Not Authorized" });
					return next(err);
				}
				else {
					res.render('profile', { username: req.session.username });
				}
			}
		});
});

module.exports = router;