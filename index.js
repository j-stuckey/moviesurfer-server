'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('isomorphic-fetch');

const usersRouter = require('./routes/users');

const { PORT, CLIENT_ORIGIN, API_KEY } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

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

// Mount routers here
app.use('/api/users', usersRouter);

app.get('/api/movies', (req, res, next) => {
    const searchTerm = req.query.title;
    if (searchTerm) {
        fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`)
            .then(apiResponse => {
                if (!apiResponse.ok) {
                    return Promise.reject(apiResponse.statusText);
                }
                return apiResponse;
            })
            .then(apiResponse => apiResponse.json())
            .then(data => res.json(data))
            .catch(err => next(err));
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
    } else {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
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
