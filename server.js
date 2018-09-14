const mongoose 		= require('mongoose');
const express 		= require('express');
const session 		= require('express-session');
const MongoStore 	= require('connect-mongo')(session);

const login 		= require('./routes/login');
const create_user 	= require('./routes/create_user');
const custom 		= require('./routes/custom');
const options		= require('./routes/options');
const app 			= express();
const User 			= require('./models/user');

app.set('view engine', 'ejs');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/liftBuddy')
	.then(()	=> console.log("connected to MongoDB..."))
	.catch(err	=> console.log("could not connect to MongoDB..."));

mongoose.Promise = global.Promise;
const db = mongoose.connection;

app.use(express.static(__dirname + '/public'));

app.use(session({
	cookieName: 'session',
	secret: 'happy days',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore ({
		mongooseConnection: db,
		ttl: 2 * 24 * 60 * 60
	})
}));

app.use(express.json());
app.use('/login', login);
app.use('/create_user', create_user);
app.use('/custom', custom);
app.use('/options', options);

app.get('/', function (req, res) {
	if (req.session && req.session.userId) {
		User.findOne({email: req.session.email}, function(err, user) {
			if (!user) {
				req.session.reset();
				res.render('homepage');
			}
			else {
				res.locals.userId = req.session.userId;
				req.session.username = user.username;
				res.render('profile', { name: req.session.username });
			}
		});
	}
	else {
		res.render('homepage');
	}
});

app.put('/del_options', function (req, res) {
	User.findOne({email: req.session.email}, function (err, user) {
		let ind1 = req.body.ind1;
		let ind2 = req.body.ind2;
		user.customOption[ind1].splice(ind2, 1);
		user.markModified('customOption');
		user.save(function(err, updatedUser) {
			if (err) return handleError(err);
			res.send(updatedUser);
		});
	});
})

app.get('/logout', function (req, res, next) {
	if(req.session) {
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			}
			else {
				return res.redirect('/');
			}
		});
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));