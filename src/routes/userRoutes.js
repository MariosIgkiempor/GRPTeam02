const express = require('express')
const router = express.Router()
const User = require('../models/User') // bring in the User model

router.post('/register', (req, res) => {
  console.log(req.body)
})

module.exports = router
