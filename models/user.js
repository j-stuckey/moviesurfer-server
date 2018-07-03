'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    LastName: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.password;
    }
});

module.exports = mongoose.model('User', userSchema);
