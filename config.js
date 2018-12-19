'use strict';
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8080,
    CLIENT_ORIGIN:
		process.env.CLIENT_ORIGIN || 'https://moviesurfer.herokuapp.com/',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/moviesurfer',
    TEST_DATABASE_URL:
		process.env.TEST_DATABASE_URL || 'mongodb://localhost/moviesurfer',
    API_KEY: process.env.API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3d'
};
