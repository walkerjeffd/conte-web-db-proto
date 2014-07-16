var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , User = mongoose.model('User');

module.exports = function (passport, config) {
  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  });

  // use local strategy
  passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      user.comparePassword(password, function(err, isMatch) {
        if (err) return done(err);
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));

  // passport.use(new LocalStrategy({
  //     usernameField: 'email',
  //     passwordField: 'password'
  //   },
  //   function(email, password, done) {
  //     User.findOne({ email: email }, function (err, user) {
  //       if (err) { return done(err) }
  //       if (!user) {
  //         return done(null, false, { message: 'Unknown user' })
  //       }
  //       if (!user.authenticate(password)) {
  //         return done(null, false, { message: 'Invalid password' })
  //       }
  //       return done(null, user)
  //     })
  //   }
  // ));
}