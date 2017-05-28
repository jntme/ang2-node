const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const debug = require('debug')('server');

// load up the user model
var User = require('../models/user');
var config = require('../config/database'); // get db config file

module.exports = function(passport) {
    var opts = {};
    opts.secretOrKey = config.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({ id: jwt_payload.id }, function(err, user) {

            if (err) {
                return done(err, false);
            }
            if (user) {
                debug(user);
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};