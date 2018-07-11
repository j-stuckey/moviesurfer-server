'use strict';

const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true }]
});

listSchema.index({ title: 1, userId: 1 }, { unique: true });

// Adds created at and updated at timestampss
listSchema.set('timestamps', true);

listSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('List', listSchema);
