#!/usr/bin/env node

var _ = require('lodash')
  , app = require('../app')
  , mongoose = require('mongoose')
  , Variable = mongoose.model('Variable')
  , User = mongoose.model('User')
  , Series = mongoose.model('Series')
  , Location = mongoose.model('Location');

Series.find({})
  .populate('location', 'state', {'state': 'ME'})
  .exec(function (err, series) {
    if (err) throw(err);
    series = _.filter(series, function (s) {
      return s.location;
    });
    console.log(series);
    process.exit();
  });