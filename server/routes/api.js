const express = require('express');
const router = express.Router();

const User = require('../models/user');
const debug = require('debug')('server');
const jwt = require('jwt-simple');

const passport = require('passport');
const mongoose = require('mongoose');

var config = require('../config/database');


mongoose.connect(config.database);

// pass passport for configuration
require('../config/passport')(passport);


// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

// Get all posts
router.get('/posts', (req, res) => {
    // Get posts from the mock api
    // This should ideally be replaced with a service that connects to MongoDB
    axios.get(`${API}/posts`)
        .then(posts => {
            res.status(200).json(posts.data);
        })
        .catch(error => {
            res.status(500).send(error)
        });
});

router.get('/memberinfo', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
            } else {
                debug("Authentication true!");
                res.json({
                    success: true,
                    memberinfo: {
                        'name': user.name,
                        email: user.email
                    }

                });
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No token provided.' });
    }
});

getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;