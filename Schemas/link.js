const mongoose = require('mongoose');

const country = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },

    clicks: { 
        type: Number,
        default: 0
    }
});

const device = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },

    clicks: { 
        type: Number,
        default: 0
    }
});

const link = new mongoose.Schema({
    email: { // Email of the user that created the link
        type: String,
        required: true
    },

    shortURL: { // Shortened link
        type: String,
        required: true 
    },

    longURL: { // Original link
        type: String,
        required: true 
    },

    clicks: { //
        type: Number,
        default: 0
    },

    countries: [country],

    devices : [device],

    date: { // Date the link was created
        type: String
    }
});

module.exports = mongoose.model('link', link);