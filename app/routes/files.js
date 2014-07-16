var express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , File = mongoose.model('File');

// Files list
router.get('/', function(req, res) {
  File.find(function(err, files) {
    res.render('files/list', { files: files });
  });
});

// File upload - GET
router.get('/upload', function(req, res) {
  res.render('files/upload', {  });
});

// File upload - POST
router.post('/upload', function(req, res, next) {
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
router.get('/:id/download', function (req, res, next) {
  File.findById(req.params.id, function(err, file) {
    if (err) return next(err);
    res.download(file.file.url, file.filename);
  });
});

// File detail
router.get('/:id', function (req, res, next) {
  File.findById(req.params.id, function(err, file) {
    if(err) return next(err);
    res.render('files/detail', { file: file});
  });
});

module.exports = router;