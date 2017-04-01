const express = require('express');
const router = express.Router();

const passport = require('passport');
const passportConfig = require('../config/passport');

router.get('/login', function(req, res, next) {
    res.render('account/login', {
        title: 'login'
    });
})

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});


module.exports = router;