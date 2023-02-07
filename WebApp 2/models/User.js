const mongoose = require('mongoose')
const Schema = mongoose.Schema
const findOrCreate = require('mongoose-findorcreate')

const userSchema = new Schema({
    username:{
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    userID: {
        type: Number,
    },
    image: {
        type: String,
    },
    city: {
        type: String
    },
    visitedTime: {
        type: String
    },
    role: {
        type: String,
        default: 'User',
    },
})

userSchema.plugin(findOrCreate)

module.exports = mongoose.model('users', userSchema)