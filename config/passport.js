let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/User');

/* Defining a Local Strategy for user Authentication  */
passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
},function(email, password, done) {
    User.findOne({email:email}).then(function(user) {
        if(!user || !user.validPassword(password) ) {
            return done(null, false, {errors:{'email or password':'is invalid'}});
        }

        return done(null, user);
    }).catch(done);

}));

module.exports = passport;