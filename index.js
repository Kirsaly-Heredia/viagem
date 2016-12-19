//load modules
var express = require('express');
var hbs = require('express-handlebars');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

//load .env
require('dotenv').config();

//create app
var app = express();
var PORT = process.env.PORT || 8081;

app.use(cookieParser());

// set cookieSecret in .env
app.use(session({
    secret: process.env.cookieSecret,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave: false,
    saveUninitialized: true,
    // add session store
    store: new MongoStore({
      url: process.env.DB_URL
    })
  }
));

// attach req.session.flash to res.locals
app.use(function(req, res, next) {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// init handlebars
app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// add form fields to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL);


var options = {};
var auth = require('./lib/auth')(app, options);
auth.init();
auth.registerRoutes();

var post = require('./routes/posts')
app.use('/', post)

app.use(express.static('public'));

//---------routes---------
app.get('/', function(req, res) {
  res.render('explore');
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/add', function(req, res) {
  res.render('new-post');
});

// start server
app.listen(PORT, function() {
  console.log('listening on port ', PORT);
});