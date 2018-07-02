'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
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
    const movies = [
        {
            Title: 'The Matrix',
            Year: '1999',
            imdbID: 'tt0133093',
            Type: 'movie',
            Poster:
                'https://ia.media-imdb.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg'
        },
        {
            Title: 'The Matrix Reloaded',
            Year: '2003',
            imdbID: 'tt0234215',
            Type: 'movie',
            Poster:
                'https://ia.media-imdb.com/images/M/MV5BYzM3OGVkMjMtNDk3NS00NDk5LWJjZjUtYTVkZTIyNmQxNDMxXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg'
        },
        {
            Title: 'Matrix Revolutions',
            Year: '2003',
            imdbID: 'tt0242653',
            Type: 'movie',
            Poster:
                'https://images-na.ssl-images-amazon.com/images/M/MV5BNzNlZTZjMDctZjYwNi00NzljLWIwN2QtZWZmYmJiYzQ0MTk2XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg'
        },
        {
            Title: 'The Matrix Revisited',
            Year: '2001',
            imdbID: 'tt0295432',
            Type: 'movie',
            Poster:
                'https://ia.media-imdb.com/images/M/MV5BMTIzMTA4NDI4NF5BMl5BanBnXkFtZTYwNjg5Nzg4._V1_SX300.jpg'
        },
        {
            Title: 'Armitage III: Dual Matrix',
            Year: '2002',
            imdbID: 'tt0303678',
            Type: 'movie',
            Poster:
                'https://images-na.ssl-images-amazon.com/images/M/MV5BOTUwOTY3Mjg1MF5BMl5BanBnXkFtZTcwODI2MTAyMQ@@._V1_SX300.jpg'
        },
        {
            Title: 'Sex and the Matrix',
            Year: '2000',
            imdbID: 'tt0274085',
            Type: 'movie',
            Poster: 'N/A'
        },
        {
            Title: 'Buhera mátrix',
            Year: '2007',
            imdbID: 'tt0970173',
            Type: 'movie',
            Poster:
                'https://images-na.ssl-images-amazon.com/images/M/MV5BMGZiNzdmYWUtZTY0ZS00ZGU4LWE1NDgtNTNkZWM3MzQ0NDY4L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMjIzMDAwOTc@._V1_SX300.jpg'
        },
        {
            Title: "Return to Source: Philosophy & 'The Matrix'",
            Year: '2004',
            imdbID: 'tt0439783',
            Type: 'movie',
            Poster:
                'https://images-na.ssl-images-amazon.com/images/M/MV5BODIwNDQ3MTYtMWZiYS00MDYyLWI4ZGEtZjBkODU4NTgyNDFkXkEyXkFqcGdeQXVyMjM3ODA2NDQ@._V1_SX300.jpg'
        },
        {
            Title: "Making 'The Matrix'",
            Year: '1999',
            imdbID: 'tt0365467',
            Type: 'movie',
            Poster: 'N/A'
        },
        {
            Title: 'Sex Files: Sexual Matrix',
            Year: '2000',
            imdbID: 'tt0224086',
            Type: 'movie',
            Poster: 'N/A'
        }
    ];

    res.json(movies);
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
