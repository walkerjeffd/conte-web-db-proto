var express = require('express')
  , session = require('express-session')
  , path = require('path')
  , favicon = require('static-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , flash = require('connect-flash')
  , mongodb = require('mongodb')
  , mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10
  , multer = require('multer')
  , crate = require('mongoose-crate')
  , LocalFS = require('mongoose-crate-localfs');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

mongoose.connect('localhost', 'test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

// User Schema
var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

var FileSchema = new mongoose.Schema({
  description: String,
  filename: String
});

FileSchema.plugin(crate, {
  storage: new LocalFS({
    directory: './files'
  }),
  fields: {
    file: {}
  }
});

var File = mongoose.model('File', FileSchema);

// Seed a user
// var user = new User({ username: 'bob', email: 'bob@example.com', password: 'secret' });
// user.save(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('user: ' + user.username + " saved.");
//   }
// });

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

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
    res.render('files_list', { user: req.user, message: req.flash('info'), files: files });
  });
});

// File upload - GET
app.get('/files/upload', function(req, res) {
  res.render('file_upload', { user: req.user, message: req.flash('info') });
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
    res.render('file_detail', { user: req.user, message: req.flash('info'), file: file});
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
