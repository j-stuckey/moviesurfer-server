'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('isomorphic-fetch');

const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const moviesRouter = require('./routes/movies');
const listsRouter = require('./routes/lists');

const { PORT, CLIENT_ORIGIN, API_KEY } = require('./config');
const { dbConnect } = require('./db-mongoose');

const app = express();

app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
        skip: (req, res) => process.env.NODE_ENV === 'test'
    })
);

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

// Parsing request body
app.use(express.json());

// Configures pasport to use the Strategies
passport.use(localStrategy);
passport.use(jwtStrategy);

// Mount routers here
app.use('/api/movies', moviesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/lists', listsRouter);

app.use('/api/info', (req, res, next) => {
    const imdbId = req.query.imdbId;

    return fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbId}`)
        .then(apiResponse => apiResponse.json())
        .then(data => {
            return res.json(data);
        })
        .catch(err => next(err));
});

app.get('/api/search', (req, res, next) => {
    const searchTerm = req.query.title;
    if (searchTerm) {
        return fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`
        )
            .then(apiResponse => apiResponse.json())
            .then(data => {
                if (data.Response === 'True') {
                    return res.json(data);
                }
                next(data.Error);
            });
    }

    // res.json('No search results found');
});

// Custom 404 Not Found route handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
    if (err.status) {
        const errBody = Object.assign({}, err, { message: err.message });
        res.status(err.status).json(errBody);
    }
    if (err.code === 11000) {
        res.status(400).json({ message: 'That list name already exists' });
    } else {
        if (err === 'Movie not found!') {
            console.log(err);
            res.status(500).json({ message: err });
        } else {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

function runServer(port = PORT) {
    const server = app
        .listen(port, () => {
            console.info(`App listening on port ${server.address().port}`);
        })
        .on('error', err => {
            console.error('Express failed to start');
            console.error(err);
        });
}

if (require.main === module) {
    dbConnect();
    runServer();
}

module.exports = { app };
