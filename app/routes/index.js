var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express', user: req.user, message: req.flash('info') });
});

module.exports = router;
