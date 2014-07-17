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

// Series list
router.get('/', function(req, res) {
  Series.find({}).populate('variable location').exec(function(err, series) {
    res.render('series/list', { series: series });
  });
});

router.get('/state/:state', function(req, res) {
  filterSeriesByState(req.params.state, function (err, series) {
    res.render('series/list', { series: series });
  });
});

// Series detail
router.get('/:id', function (req, res, next) {
  Series.findOne({'_id': req.params.id})
    .populate('variable location')
    .exec(function(err, series) {
      if(err) return next(err);
      var values = _.map(series.values, function(d) { return { datetime: d.datetime, value: d.value }; });
      res.render('series/detail', { series: series, values: values});
    }
  );
});


function filterSeriesByState (state, callback) {
  Series.find({})
    .populate('variable location')
    .exec(function (err, series) {
      if (err) throw(err);
      series = _.filter(series, function (s) {
        return s.location.state === state;
      });
      callback(err, series);
});
}

module.exports = router;