'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const List = require('../models/list');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
    const userId = req.user.id;
    console.log(userId);

    List.find({ userId })
        // .populate('movieId')
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

    // movieId might not need to go here, figure it out.

    const newList = {
        title: title.toLowerCase(),
        userId
    };
    if (!title) {
        const err = new Error('Missing `title` in request body');
        err.status = 400;
        return next(err);
    }

    List.create(newList)
        .then(result => {
            res.location(`${req.originalUrl}/${result.id}`)
                .status(201)
                .json(result);
        })
        .catch(err => next(err));
});

router.put('/', (req, res, next) => {
    const { movieId, listId } = req.body;
    const userId = req.user.id;

    const updateList = { movieId, userId };

    List.findById({ _id: listId })
        .then(list => {
            list.movies.push(movieId);
            return list.save();
        })
        .then(() => res.status(204).send())
        .catch(err => next(err));
});
module.exports = router;
