'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.post('/', (req, res, next) => {
    let { username, password, firstName, lastName, email } = req.body;

    return User.hashPassword(password)
        .then(digest => {
            const newUser = {
                firstName,
                lastName,
                username: username.toLowerCase(),
                email,
                password: digest
            };
            return User.create(newUser);
        })
        .then(result => {
            return res
                .status(201)
                .location(`/api/users/${result.id}`)
                .json(result);
        })
        .catch(err => {
            if (err.code === 11000) {
                err = new Error('The username already exists');
                err.status = 400;
            }
            next(err);
        });
});

module.exports = router;
