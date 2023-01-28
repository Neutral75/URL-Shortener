const mongoose = require('mongoose');

const link = new mongoose.Schema({
    email: { // Email of the user that created the link
        type: String
    },

    shortLink: { // Shortened link
        type: String
    },

    longLink: { // Original link
        type: String
    },

    clicks: { //
        type: Number,
        default: 0
    },

    countries: {
        'BR, MX, US': { // Brazil, Mexico, United States
            type: Number,
            default: 0
        },

        'DE, FR, UK': { // Germany, France, United Kingdom
            type: Number,
            default: 0
        },

        'CN, TR, RU': { // China, Turkey, Russia
            type: Number,
            default: 0
        },

        'IN, PK, NG': { // India, Pakistan, Nigeria
            type: Number,
            default: 0
        },

        'Other': { // All other countries
            type: Number,
            default: 0
        },
    },

    devices: {
        'Mobile': { // Amount of clicks on a mobile phone
            type: Number,
            default: 0
        },

        'Computer': { // Amount of clicks on a computer
            type: Number,
            default: 0
        }
    },

    date: { // Date the link was created
        type: String
    }
});

module.exports = mongoose.model('link', link);