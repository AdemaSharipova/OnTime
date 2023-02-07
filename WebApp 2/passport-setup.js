const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User')
const GOOGLE_CLIENT_ID = '137339416212-83k6qcakv86glub7562dcb8lcr5p9o1r.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})



passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "https://localhost:300/google/callback",
    },
    function(accessToken, refreshToken, profile, done) {
        //check user table for anyone with a facebook ID of profile.id
        User.findOne({
            'google.id': profile.id
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'google',
                    //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                    google: profile._json
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }

        });
    }
));