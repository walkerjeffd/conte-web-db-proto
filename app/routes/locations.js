var _ = require('lodash')
  , async = require('async')
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

// Location list
router.get('/', function(req, res) {
  Location.find({}).exec(function(err, locations) {
    res.render('locations/list', { locations: locations });
  });
});

// Location detail
router.get('/:id', function (req, res, next) {
  Location.findOne({'_id': req.params.id})
    .exec(function(err, location) {
      Series.find({'location': location._id}).populate('variable location')
        .exec(function (err, series) {
          if(err) return next(err);
          res.render('locations/detail', { location:location, series: series});
      });
    });
});

module.exports = router;