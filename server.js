const mongoose 		= require('mongoose');
const express 		= require('express');
const session 		= require('express-session');
const MongoStore 	= require('connect-mongo')(session);
const cookieParser 	= require('cookie-parser');

const login 		= require('./routes/login');
const create_user 	= require('./routes/create_user');
const profile		= require('./routes/profile');
const app 			= express();
const User 			= require('./models/user');


app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/liftBuddy')
	.then(()=>console.log("connected to MongoDB..."))
	.catch(err=>console.log("could not connect to MongoDB..."));

mongoose.Promise = global.Promise;
const db = mongoose.connection;

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.use(session({
	cookieName: 'session',
	secret: 'happy days',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore ({
		mongooseConnection: db
	})
}));

app.use(express.json());
app.use('/login', login);
app.use('/create_user', create_user);
app.use('/profile', profile);

app.get('/', function(req, res) {
	if (req.session && req.session.userId) {
		User.findOne({email: req.session.email}, function(err, user) {
			if (!user) {
				req.session.reset();
				res.render('homepage');
			}
			else {
				res.locals.userId = req.session.userId;
				console.log("server.js");
				res.render('profile', { name: req.session.username });
			}
		});
	}
	else {
		res.render('homepage');
	}
});

app.get('/logout', function (req, res, next) {
	if(req.session) {
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			}
			else {
				return res.redirect('/');
			}
		})
	}
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));