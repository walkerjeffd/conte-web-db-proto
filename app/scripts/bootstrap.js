#!/usr/bin/env node

var app = require('../app')
  , mongoose = require('mongoose')
  , Variable = mongoose.model('Variable')
  , User = mongoose.model('User')
  , Location = mongoose.model('Location');

User.create({ username: 'jeff', email: 'jeff@walkerjeff.com', password: 'conte' });

Location.create([
  { name: 'Brunswick', latitude: 43.910833, longitude: -69.963056, state: 'ME'},
  { name: 'Portland', latitude: 43.666667, longitude: -70.266667, state: 'ME'},
  { name: "Turner's Falls", latitude: 42.598889, longitude: -72.556944, state: 'MA'},
  { name: "Boston", latitude: 42.358056, longitude: -71.063611, state: 'MA'}
]);

Variable.create([
  { name: 'Streamflow', units: 'ft^3/sec'},
  { name: 'Water Temperature', units: 'degC'}
]);