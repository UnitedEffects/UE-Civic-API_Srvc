var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.redirect('/docs');
    res.render('index', {title: 'Express Checkout'});
});

module.exports = router;