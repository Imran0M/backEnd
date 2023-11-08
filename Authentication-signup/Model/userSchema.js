const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
})

const User = mongoose.model('UserAuth', userSchema)
module.exports = User