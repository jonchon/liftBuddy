//log in an create user code based off of https://github.com/Createdd/authenticationIntro
const mongoose 		= require('mongoose');
const bcrypt 		= require('bcrypt-nodejs');
const Schema 		= mongoose.Schema;
//defining the schema for log in credentials
const UserSchema = new mongoose.Schema({
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
	custom: {
		type: [String]
	},
	customOption: {
		type: [Schema.Types.Mixed]
	},
});

//see if user exists in the database
UserSchema.statics.authenticate = function (email, password, callback) {
	User.findOne({ email: email })
		.exec(function (err, user) {
			if (err) {
				return callback(err)
			}
			else if (!user) {
				let err = new Error('User not found.');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password, user.password, function (err, result) {
				if (result === true) {
					return callback(null, user);
				}
				else {
					return callback();
				}
			})
		})
}

//hash password before saving to MongoDB
UserSchema.pre('save', function(next) {
	let user = this;
	if (!user.isModified('password')) return next();
	bcrypt.hash(user.password, 10, function (err, hash) {
		if (err) {
			return next(err);
		}
		user.password = hash;
		next();
	})
});

if (typeof passwordConf !== 'undefined') {
	UserSchema.pre('save', function(next) {
		let user = this;
			bcrypt.hash(user.passwordConf, 10, function (err, hash) {
			if (err) {
				return next(err);
			}
			user.passwordConf = hash;
			next();
		})
	});
}

const User = mongoose.model('User', UserSchema);
module.exports = User;