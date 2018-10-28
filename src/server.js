const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// initialise express
const app = express()

// add body-parser middleware
app.use(bodyParser.json())

// bring in database config
const db = require('./config/config.js').mongoURI

// connect to the MongoDB databse
mongoose.connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log(`MongoDB connection error ${error}`))

const port = 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`))
