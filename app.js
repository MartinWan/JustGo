const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const errorHandler = require('errorhandler');
const flash = require('express-flash');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sass = require('node-sass-middleware');
const mongoose = require('mongoose');
const lusca = require('lusca');

const homeController = require('./controllers/home');
const aboutController = require('./controllers/about');
const userController = require('./controllers/user');
const oAuthController = require('./controllers/oauth');
const gameController = require('./controllers/game');
const matchMakingController = require('./controllers/matchMaking')
const userAuthentication = require('./controllers/helpers/userAuthentication')

const app = express();

require('./config/passport');

// mongo database setup
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established!');
});
mongoose.connection.on('error', () => {
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

// session and csrf setup
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.csrf());
app.use(bodyParser.json());

// view engine setup
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(flash());

// controller setup
app.use('/', homeController);
app.use('/about', aboutController);
app.use('/user', userController);
app.use('/auth', oAuthController);
app.use('/game', userAuthentication.requireAuthentication, gameController);
app.use('/match', userAuthentication.requireAuthentication, matchMakingController)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (process.env.NODE_ENV === "development") {
  // development-only error handler with stack trace
  app.use(errorHandler());
}

module.exports = app;