// Get dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const debug = require('debug')('server');
const passport = require('passport');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');

// get config
var config = require('./config/database');

mongoose.connect(config.database);

// get user model
var User = require('./models/user');

// Get our API routes
const api = require('./routes/api');
const auth = require('./routes/auth')


// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
// app.use(passport.initialize());

// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')));

// Set our api routes
app.use('/api', api);
app.use('/auth', auth);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port, () => {
    debug(`API running on localhost:${port}`)
});