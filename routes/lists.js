'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const List = require('../models/list');
const Movie = require('../models/movie');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
    const userId = req.user.id;

    List.find({ userId })
        .populate('movies')
        .then(results => {
            console.log(results);
            return res.json(results);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    
    List.findOne({ _id: id })
        .populate('movies')
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        });
});

router.post('/', (req, res, next) => {
    const { title } = req.body;
    const userId = req.user.id;

    const newList = {
        title: title.toLowerCase(),
        userId
    };
    if (!title) {
        const err = new Error('List name cannot be blank');
        err.status = 400;
        return next(err);
    }

    List.create(newList)
        .then(result => {
            console.log(result);
            res.location(`${req.originalUrl}/${result.id}`)
                .status(201)
                .json(result);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

router.put('/', (req, res, next) => {

    const userId = req.user.id;

    const { movieId, listId, year, title, poster } = req.body;
    const newMovie = { movieId, listId, year, title, userId, poster };

    let newList;
    List.findById({ _id: listId })
        .populate('movies')
        .then(list => {
            newList = list;
            return Movie.create(newMovie);
        })
        .then(movie => {
            newList.movies.push(movie);
            return newList.save();
        })
        .then(result => {
            console.log(result);
            res.location(`${req.originalUrl}/${result.id}`)
                .status(201)
                .json(result);
        })
        .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {

    const { id } = req.params;

    const userId = req.user.id;


    // List.findByIdAndRemove({ _id: listId });
    List.findOneAndRemove({ _id: id })
        .then(result => {
            console.log(result);
            res.location(`${req.originalUrl}/${result.id}`)
                .status(201)
                .json(result);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

module.exports = router;
