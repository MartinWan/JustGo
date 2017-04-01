const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        req.flash('errors', { msg: 'You are already logged in.' });
        done();
    } else {
        const gmail = profile.emails[0].value;
        User.findOne({ email: gmail }, (err, existingUser) => {
            if (err) { return done(err); }
            if (existingUser) {
                return done(null, existingUser);
            }
            const user = new User();
            user.email = gmail;
            user.token = accessToken;
            user.profile.name = profile.displayName;
            user.profile.gender = profile._json.gender;
            user.profile.picture = profile._json.image.url;
            user.save(err => done(err, user));
        });
    }
}));