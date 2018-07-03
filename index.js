'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('isomorphic-fetch');

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
