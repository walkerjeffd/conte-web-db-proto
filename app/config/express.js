var express = require('express')
  , session = require('express-session')
  , flash = require('connect-flash')
  // , winston = require('winston')
  // , helpers = require('view-helpers')
  , favicon = require('static-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , multer = require('multer')
  , pkg = require('../package.json')

var env = process.env.NODE_ENV || 'development'

module.exports = function (app, config, passport) {

  app.set('showStackError', true);

  // should be placed before express.static
  // app.use(express.compress({
  //   filter: function (req, res) {
  //     return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
  //   },
  //   level: 9
  // }))

  app.use(favicon());
  app.use(express.static(config.root + '/public'))

  // Logging
  if (env !== 'test') app.use(logger('dev'));

  // set views path, template engine and default layout
  app.set('views', config.root + '/views');
  app.set('view engine', 'ejs');

  // expose package.json to views
  app.use(function (req, res, next) {
    res.locals.pkg = pkg
    next()
  })

  // cookieParser should be above session
  app.use(cookieParser());

  // bodyParser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(multer({ dest: config.root + '/uploads' }));

  // expresssession storage
  app.use(session({ 
    secret: pkg.name, 
    resave: true, 
    saveUninitialized: true,
    cookie: {maxAge: 3600000} 
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash for flash messages - should be declared after sessions
  app.use(flash());

  // should be declared after session and flash
  // app.use(helpers(pkg.name))

  // adds CSRF support
  // if (process.env.NODE_ENV !== 'test') {
  //   app.use(express.csrf())

  //   // This could be moved to view-helpers :-)
  //   app.use(function(req, res, next){
  //     res.locals.csrf_token = req.csrfToken()
  //     next()
  //   })
  // }

  // Add user to all renders
  app.use(function(req, res, next){
    res.locals.user = req.user;
    // res.locals.message = [''];
    res.locals.message = { 
      'info': req.flash('info'),
      'error': req.flash('error')
    };
    next();
  });

  // Bootstrap routes
  require('./routes')(app, passport);

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

  // // assume "not found" in the error msgs
  // // is a 404. this is somewhat silly, but
  // // valid, you can do whatever you like, set
  // // properties, use instanceof etc.
  // app.use(function(err, req, res, next){
  //   // treat as 404
  //   if (err.message
  //     && (~err.message.indexOf('not found')
  //     || (~err.message.indexOf('Cast to ObjectId failed')))) {
  //     return next()
  //   }

  //   // log it
  //   // send emails if you want
  //   console.error(err.stack)

  //   // error page
  //   res.status(500).render('500', { error: err.stack })
  // })

  // // assume 404 since no middleware responded
  // app.use(function(req, res, next){
  //   res.status(404).render('404', {
  //     url: req.originalUrl,
  //     error: 'Not found'
  //   })
  // })
}