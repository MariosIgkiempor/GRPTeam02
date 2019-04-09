// Author: Marios Igkiempor 10335752

const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username' },
      (username, password, done) => {
        // Match user to database
        User.findOne({ username: username })
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'Username not found' })
            }

            // Match password with database
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err

              if (isMatch) {
                return done(null, user)
              } else {
                return done(null, false, { message: 'Password incorrect' })
              }
            })
          })
          .catch(err => console.log(err))
      }
    )
  )

  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) =>
    User.findById(id, (err, user) => {
      done(err, user)
    })
  )
}
