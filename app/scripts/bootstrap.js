#!/usr/bin/env node

var app = require('../app')
  , mongoose = require('mongoose')
  , Variable = mongoose.model('Variable')
  , User = mongoose.model('User');

User.create({ username: 'jeff', email: 'jeff@walkerjeff.com', password: 'conte' });
