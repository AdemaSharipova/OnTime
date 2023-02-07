const mongoose = require('mongoose')
const Schema = mongoose.Schema


const savedChallengesSchema = new Schema({
    userId: String,
    title: String,
    category: String,
    image: String,
    date: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('savedChallenges', savedChallengesSchema)