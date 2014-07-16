var async = require('async')
  , fs = require('fs')
  , express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , csv = require('csv')
  , Location = mongoose.model('Location')
  , Series = mongoose.model('Series')
  , Variable = mongoose.model('Variable')
  , File = mongoose.model('File')
  , Dataset = mongoose.model('Dataset');

// Datasets list
router.get('/', function(req, res) {
  Dataset.find({})
    .populate('file user')
    .exec(function(err, datasets) {
      res.render('datasets/list', { datasets: datasets });
    });
});

// Dataset upload - GET
router.get('/upload', function(req, res) {
  res.render('datasets/upload');
});

// Dataset upload - POST
router.post('/upload', function(req, res, next) {
  async.waterfall([
    function (callback) {
      var file = new File();
      file.filename = req.files.file.originalname;
      file.description = req.body.description;
      file.user = req.user;
      file.attach('file', req.files.file, function(err) {
        if(err) return next(err);
        file.save(function(err) {
          if(err) return next(err);
          callback(null, file);
        });
      });
    },
    function (file, callback) {
      Location.create({name: req.body.location_name, user: req.user}, function (err, location) {
        if (err) next(err);
        callback(null, file, location);
      });
    },
    function (file, location, callback) {
      Variable.create({name: req.body.variable_name}, function (err, variable) {
        if (err) next(err);
        callback(null, file, location, variable);
      })
    },
    function (file, location, variable, callback) {
      var parser = csv.parse({columns: ['DATE','VALUE']}, function (err, data) {
        data.shift() // drop first header row
        var series = new Series();
        series.location = location;
        series.variable = variable;
        data.forEach(function (d) {
          series.values.push({'datetime': new Date(Date.parse(d.DATE)), 'value': +d.VALUE});
        });
        series.save(function (err, series) {
          console.log(series);
          if (err) next(err);
          callback(null, file, series);
        });
      });
      fs.createReadStream(file.file.url).pipe(parser);
    }, 
    function (file, series, callback) {
      var dataset = new Dataset({file: file, user: req.user, series: series});
      dataset.save(function (err, dataset) {
        if(err) return next(err);
        callback(null, dataset);
      });
    }
  ], function (err, result) {
    if(err) return next(err);
    req.flash('info', 'Dataset has been uploaded.');
    res.redirect('/datasets/' + result.id);
  });
});

// Dataset detail
router.get('/:id', function (req, res, next) {
  Dataset.findOne({'_id': req.params.id})
    .populate('user file series')
    .exec(function(err, dataset) {
      if(err) return next(err);
      res.render('datasets/detail', { dataset: dataset});
    }
  );
});

module.exports = router;