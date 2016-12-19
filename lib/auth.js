var passport = require('passport');
var LocalStrategy = require('passport-local');

var path = require('path');
var multer = require('multer');
var uploadPath = path.join(__dirname, '../public/propic');
var upload = multer({ dest: uploadPath});

var User = require('../models/user');

module.exports = function (app, options) {
  
  return {
    init: function () {
      
      passport.use(new LocalStrategy(User.authenticate()));
      
      passport.serializeUser(function (user, done) {
        done(null, user._id);
      });
      
      passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
          if (err || !user) {
            return done(err, null);
          } 
          done(null, user);
        });
      });
      
      app.use(passport.initialize());
      app.use(passport.session());
      
      app.use(function (req, res, next) {
        res.locals.user = req.user;
        next();
      });
    },
    
    registerRoutes: function () {
      
      app.get('/signup', function (req, res) {
        res.render('signup');
      });
      
      app.post('/signup', upload.single('propic'),function (req, res, next) {
        
        var newUser = new User({
          name: req.body.name,
          username: req.body.username,
          propic: req.file.propic          
        });
        
        User.register(newUser, req.body.password, function (err, user) {
          if (err) {
            console.log(err);
            console.log('signup error!, err');
            
            return res.render('signup', {
              flash: {
                type: 'negative',
                header: 'Signup Error',
                body: err.message
              }
            });
          }
          
          passport.authenticate('local')(req, res, function () {
            req.session.flash = {
              type: 'positive',
              header: 'Registration Success',
              body: 'Welcome, ' + user.username
            };
            res.redirect('/');
          });                    
        });
      });
      
      app.get('/login', function (req, res) {
        res.render('login');
      });
      
      app.post('/login', passport.authenticate('local'),
      function (req, res, next) {
        req.session.flash = {
          type: 'positive',
          header: 'Signed in',
          body: 'Welcome, ' + req.body.username
        };
        res.redirect('/');
      });
      
      app.get('/logout', function(req, res) {
        req.logout();
        req.session.flash = {
          type: 'positive',
          header: 'Signed out',
          body: 'Successfully signed out'
        };
        res.redirect('/');
      });
    }
  };
};