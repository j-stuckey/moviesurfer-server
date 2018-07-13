'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { JWT_EXPIRY, JWT_SECRET } = require('../config');

const router = express.Router();
const options = { session: false, failWithError: true };

const localAuth = passport.authenticate('local', options);
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

function createAuthToken(user) {
    return jwt.sign({ user }, JWT_SECRET, {
        subject: user.username.toLowerCase(),
        expiresIn: JWT_EXPIRY
    });

    // creates an authToken with user payload
}

router.post('/login', localAuth, (req, res, next) => {
    const authToken = createAuthToken(req.user);
    res.json({ authToken });

    //No need to call next() because failWithError would do it
    // for us in case of errors/
});

router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({ authToken });
});

module.exports = router;
