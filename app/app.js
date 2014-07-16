var fs = require('fs')
  , express = require('express')
  , passport = require('passport')
  , mongoose = require('mongoose');

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env];

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } }
  mongoose.connect(config.db, options)
}
connect()

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err)
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect()
});

// Open
mongoose.connection.once('open', function () {
  console.log('Connected to DB');
});

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
});

// Passport config
require('./config/passport')(passport, config);

// Create express app
var app = express();

// Express config
require('./config/express')(app, config, passport);

// add dummy user for development
if (env === 'development') {
  User = mongoose.model('User');
  User.count({}, function (err, count) {
    if (count === 0) {
      var user = new User({ username: 'bob', email: 'bob@example.com', password: 'secret' });
      user.save(function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('user: ' + user.username + " saved.");
        }
      });
    }
  });
}

module.exports = app;
