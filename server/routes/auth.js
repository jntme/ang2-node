const express = require('express');
const User = require('../models/user');
const router = express.Router();
const debug = require('debug')('server');
const jwt = require('jwt-simple');

var config = require('../config/database');

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('auth api');
});

// create a new user account (POST http://localhost:8080/api/signup)
router.post('/signup', function(req, res) {

    if (!req.body.name || !req.body.password) {
        res.json({ success: false, msg: 'Please pass name and password.' });
    } else {
        debug("req.body.name: " + req.body.name);
        debug("req.body.password: " + req.body.password);

        var newUser = new User({
            name: req.body.name,
            password: req.body.password
        });
        debug('new user: ' + newUser);

        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({ success: false, msg: 'Username already exists.' });
            }
            res.json({ success: true, msg: 'Successful created new user.' });
        });
    }
});

router.post('/authenticate', function(req, res) {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token });
                } else {
                    res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });
});

module.exports = router;