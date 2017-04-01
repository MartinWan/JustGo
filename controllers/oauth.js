const express = require('express');
const router = express.Router();

const passport = require('passport');
const passportConfig = require('../config/passport');

router.get('/google', passport.authenticate('google', { scope: 'profile email' }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/user/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

module.exports = router;