var express = require('express')
  , router = express.Router()
  , passport = require('passport');

router.get('/', ensureAuthenticated, function(req, res){
  res.render('users/account');
});

router.get('/login', function(req, res){
  res.render('users/login');
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }),
  function(req, res) {
    req.flash('info', 'Log in successful.');
    res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('info', 'Log out successful');
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/users/login');
}

module.exports = router;
