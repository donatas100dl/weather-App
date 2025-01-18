const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        unique: true
    },
    maxTemp: {
        type: Number,
        required: true
    },
    minTemp: {
        type: Number,
        required: true
    },
    forecast: {
        type: Array,
        required: true
    }
})

const weather = new mongoose.model('Weather', weatherSchema)
module.exports = weather