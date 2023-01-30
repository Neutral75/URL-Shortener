const mongoose = require('mongoose');

const user = new mongoose.Schema({
    email: { // User's email
        type: String
    },

    premium: { // 
        type: Boolean,
        default: false
    },

    links: { // Amount of links shortened
        type: Number,
        default: 0
    },

    date: { // Date the users account was created
        type: String
    }
});

module.exports = mongoose.model('user', user);