const express = require('express')
const router = express.Router()
const emailValidator = require('email-validator')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/User') // bring in the User model

router.post('/register/', (req, res) => {
  const { username, email, password, password2 } = req.body

  let errors = []

  // Validate form input
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

  // If there were no initial errors
  if (errors.length === 0) {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push('Email already exists')
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
  }
  // Send errors back to client
  else {
    res.send(errors)
  }
})

router.post('/login/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.send({ success: false })
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      return res.send({ success: false, message: 'authentication failed' })
    }
    req.login(user, err => {
      if (err) {
        return next('error')
      }
      res.cookie('userid', user.id, { maxAge: 2592000000 })
      return res.send({ success: true, message: 'authentication succeeded' })
    })
  })(req, res, next)
})

router.get('/logout/', (req, res) => {
  req.logout()
  res.clearCookie('userid')
  res.status(200)
  res.send('logged out')
})

router.get('/loggedin/', isLoggedIn, (req, res, next) => {
  console.log('request authenticated')
  res.status(200).json(req.user)
})

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) return next()
  console.log('request not authenticated')
  res.status(400).json({
    message: 'access denied'
  })
}

module.exports = router
