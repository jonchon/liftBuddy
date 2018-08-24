const mongoose 		= require('mongoose');
const express 		= require('express');
const session 		= require('express-session');
const MongoStore 	= require('connect-mongo')(session);

const login 		= require('./routes/login');
const create_user 	= require('./routes/create_user');
const app 			= express();
const User 			= require('./models/user');


app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/liftBuddy')
	.then(()=>console.log("connected to MongoDB..."))
	.catch(err=>console.log("could not connect to MongoDB..."));

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

app.post('/names', function (req, res) {
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

app.get('/names', function (req, res) {
	if (req.session && req.session.userId) {
		User.findOne({email: req.session.email}, function (err, user) {
			res.send(user.custom);
		});
	}
});

app.put('/names:id', function (req, res) {
	if (req.session && req.session.userId) {
		User.findOne({email: req.session.email}, function (err, user) {
			let data 	= {};
			data.name 	= req.params.id.substr(1);
			data.value 	= data.name.replace(/ /g, '-');
			let ind 	= user.custom.indexOf(JSON.stringify(data));
			user.custom.splice(ind, 1);
			user.save(function(err, updatedUser) {
				if (err) return handleError(err);
				res.send(updatedUser);
			});
		});
	}
});

app.get('/options', function (req, res) {
	User.findOne({email: req.session.email}, function (err, user) {
		res.send(user.customOption);
	})
})

app.put('/options', function (req, res) {
	User.findOne({email: req.session.email}, function (err, user) {
		let ind = req.body.index;
		user.customOption[ind].push(JSON.stringify(req.body));
		let i;
		let j;
		console.log(user.customOption.length);
		console.log(user.customOption[ind].length);
		for (i = 0; i < user.customOption.length; i++) {
			for (j = 0; j < user.customOption[i].length; j++) {
				console.log(i + ' ' + user.customOption[i][j]);
			}
		}
		user.markModified('customOption');
		user.save(function(err, updatedUser) {
			if (err) return handleError(err);
			res.send(updatedUser);
		});
	});
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
		});
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));