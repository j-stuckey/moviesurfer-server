'use strict';

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieId: { type: String, required: true },
    title: { type: String },
    year: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    poster: { type: String }
});

// movieSchema.index({ movieId: 1, userId: 1 }, { unique: true });

movieSchema.set('timestamps', true);

movieSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});

module.exports = mongoose.model('Movie', movieSchema);
