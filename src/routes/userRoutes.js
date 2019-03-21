const express = require('express')
const router = express.Router()
const emailValidator = require('email-validator')
const User = require('../models/User') // bring in the User model

router.post('/register/', (req, res) => {
  const { username, email, password, password2 } = req.body

  let errors

  if (!(username && email && password && password2)) {
    errors.push('Please fill in all fields')
  }
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }
  if (password !== password2) {
    errors.push('Passwords do not match')
  }
  if (!emailValidator.validate(email)) {
    errors.push('Please enter a valid email')
  }

  if (errors.length === 0) {
    res.send('success')
  } else {
    res.send(errors)
  }
})

module.exports = router
