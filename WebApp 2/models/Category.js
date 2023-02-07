const mongoose = require('mongoose')
const Schema = mongoose.Schema


const categorySchema = new Schema({
    title: String,
    backgroundImage: String
})

module.exports = mongoose.model('categories', categorySchema)