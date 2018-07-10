const mongoose = require('mongoose');
const express = require('express');
const login = require('./routes/login');
const create_user = require('./routes/create_user');
const profile = require('./routes/profile');
const app = express();

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/liftBuddy')
	.then(()=>console.log("connected to MongoDB..."))
	.catch(err=>console.log("could not connect to MongoDB..."));

app.use(express.json());

app.use('/login', login);
app.use('/create_user', create_user);
app.use('/profile', profile);

app.get('/', function(req, res) {
	res.render('homepage')
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));