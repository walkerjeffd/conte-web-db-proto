#!/usr/bin/env node

var app = require('../app')
  , fs = require('fs')
  , mongoose = require('mongoose');

fs.readdir('../uploads', function(err, files) {
  for (i in files) {
    filename = '../uploads/' + files[i];
    fs.unlink(filename, function(err) {
      if (err) throw(err);
      console.log('Deleted:', filename);
    });
  }
});

fs.readdir('../files', function(err, files) {
  for (i in files) {
    filename = '../files/' + files[i];
    fs.unlink(filename, function(err) {
      if (err) throw(err);
      console.log('Deleted:', filename);
    });
  }
});

["User", "Series", "File", "Dataset", "Location", "Variable"].forEach(function(name) {
  model = mongoose.model(name);
  model.remove({}, function (err) {
    if (err) throw(err);
    console.log('Emptied collection for model', name);
  });
});
