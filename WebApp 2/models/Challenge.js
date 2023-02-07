const mongoose = require('mongoose')
const Schema = mongoose.Schema


const challengeSchema = new Schema({
    category: String,
    title: String,
    image: String,
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('challenges', challengeSchema)