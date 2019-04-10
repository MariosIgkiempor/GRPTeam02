// Author: Marios Igkiempor 10335752

const mongoose = require('mongoose')

// Define a basic schema for a user
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
