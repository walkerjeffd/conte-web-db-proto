var fs = require('fs')
  , express = require('express')
  , session = require('express-session')
  , path = require('path')
  , favicon = require('static-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , flash = require('connect-flash')
  , mongodb = require('mongodb')
  , multer = require('multer');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose');

// Bootstrap db connection
// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } }
  mongoose.connect(config.db, options)
}
connect()

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err)
})

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect()
})

// Open
mongoose.connection.once('open', function () {
  console.log('Connected to DB');
})

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback() {
//   console.log('Connected to DB');
// });

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
});

var User = mongoose.model('User');
var File = mongoose.model('File');

// Passport config
require('./config/passport')(passport, config);

// Seed a user
// var user = new User({ username: 'bob', email: 'bob@example.com', password: 'secret' });
// user.save(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('user: ' + user.username + " saved.");
//   }
// });

var routes = require('./routes/index');
// var files = require('./routes/files')
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(multer({ dest: './uploads' }));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
// app.use('/files', files);
// app.use('/users', users);

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user, message: req.flash('error') });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.flash('error') });
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    req.flash('info', 'Log in successful.');
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  req.flash('info', 'Log out successful');
  res.redirect('/');
});

// Files list
app.get('/files', function(req, res) {
  File.find(function(err, files) {
    console.log(files);
    res.render('files/list', { user: req.user, message: req.flash('info'), files: files });
  });
});

// File upload - GET
app.get('/files/upload', function(req, res) {
  res.render('files/upload', { user: req.user, message: req.flash('info') });
});

// File upload - POST
app.post('/files/upload', function(req, res, next) {
  console.log(req.files);
  console.log(req.body);
  var file = new File();
  file.filename = req.files.file.originalname;
  file.description = req.body.description;
  file.attach('file', req.files.file, function(err) {
    if(err) return next(err);
    file.save(function(err) {
      if(err) return next(err);
      req.flash('info', 'File has been uploaded.');
      res.redirect('/files');
    });
  });
});

// File download
app.get('/files/:id/download', function (req, res, next) {
  File.findById(req.params.id, function(err, file) {
    if (err) return next(err);
    res.download(file.file.url, file.filename);
  });
});

// File detail
app.get('/files/:id', function (req, res, next) {
  File.findById(req.params.id, function(err, file) {
    if(err) return next(err);
    console.log(req.params.id);
    console.log(file);
    res.render('files/detail', { user: req.user, message: req.flash('info'), file: file});
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            user: req.user
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        user: req.user
    });
});


module.exports = app;
