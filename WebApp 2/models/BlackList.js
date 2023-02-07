const mongoose = require('mongoose')
const Schema = mongoose.Schema


const blackListSchema = new Schema({
    category: String,
    title: String,
    userId: String,
    date: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('blackList', blackListSchema)