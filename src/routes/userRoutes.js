// Author: Marios Igkiempor 10335752
// Code inspired by Brad Traversy's node_passport_login example
// Link: https://github.com/bradtraversy/node_passport_login/blob/master/routes/users.js
// Has been editted for the purposes of this project

// Import external libraries
const express = require('express')
const router = express.Router()
const emailValidator = require('email-validator')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/User') // bring in the User model

// Route to handle new users registering
router.post('/register/', (req, res) => {
  const { username, email, password, password2 } = req.body

  let errors = []

  // Validate form input
  // Check that all fields were entered
  if (!(username && email && password && password2)) {
    errors.push('Please fill in all fields')
  }

  // Check password is long enough
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  // Check passwords match
  if (password !== password2) {
    errors.push('Passwords do not match')
  }

  // Check email is valid
  if (!emailValidator.validate(email)) {
    errors.push('Please enter a valid email')
  }

  // If there were no initial errors
  if (errors.length === 0) {
    // Check whether there exists a user with that email
    User.findOne({ email: email }).then(user => {
      // If a user exists with the entered email, send an error back to the client
      if (user) {
        errors.push('Email is already registered with an account')
        res.send(errors)
      } else {
        // Encrypt the password
        bcrypt.genSalt(16, (err, salt) => {
          if (err) throw err
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err
            let hashedPassword = hash

            // Create a new user with the encrypted password
            const newUser = new User({
              username,
              email,
              password: hashedPassword
            })

            // save the new user
            newUser
              .save()
              .then(user => res.send('success'))
              .catch(err => res.send(err))
          })
        })
      }
    })
  } else {
    // Send errors back to client
    res.send(errors)
  }
})

// Route to handle users logging in
router.post('/login/', (req, res, next) => {
  // Authenticate the current HTTP request using Passport.js
  passport.authenticate('local', (err, user, info) => {
    // If the request cannot be authenticated, send an error message back to the client
    if (err) {
      return res.send({ success: false })
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      // If the user doesn't exist, send an error back to the client
      return res.send({ success: false, message: 'authentication failed' })
    }
    req.login(user, err => {
      if (err) {
        // If the login was unsuccessful, send an error back to the client
        return next('error')
      }

      // The login was successful, create a passport cookie on the response that lasts a month
      res.cookie('userid', user.id, { maxAge: 2592000000 })
      // Send a success message back to the client
      return res.send({ success: true, message: 'authentication succeeded' })
    })
  })(req, res, next)
})

// Route to handle logging out
router.get('/logout/', (req, res) => {
  req.logout()
  res.clearCookie('userid')
  res.status(200)
  res.send('logged out')
})

// Route to check if a user is logged in
router.get('/loggedin/', isLoggedIn, (req, res, next) => {
  console.log('request authenticated')
  res.status(200).json(req.user)
})

// Helper function to check if a user is logged in
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) return next()
  console.log('request not authenticated')

  // Send an error message if the user is not logged in
  res.status(400).json({
    message: 'access denied'
  })
}

module.exports = router
