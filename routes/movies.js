'use strict';
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Movie = require('../models/movie');

const router = express.Router();

router.get('/', (req, res, next) => {
    Movie.find()
        .sort({ createdAt: 'desc' })
        .populate('listId')
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        });
});

router.post('/', (req, res, next) => {
    const { movieId, userId, listId } = req.body;
    const newMovie = { movieId, userId, listId };
    console.log(newMovie);

    Movie.create(newMovie)
        .then(result => {
            console.log(result);
            res.location(`${req.originalUrl}/${result.id}`)
                .status(201)
                .json(result);
        })
        .catch(err => next(err));
});

module.exports = router;
