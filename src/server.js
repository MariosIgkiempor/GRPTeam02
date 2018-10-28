const express = require('express')
const mongoose = require('mongoose')

const csvFiles = require('./routes/CSVFiles')

// initialise express
const app = express()

// add body-parser middleware
app.use(express.json())

// bring in database config
const db = require('./config/config.js').mongoURI

// connect to the MongoDB databse
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log(`MongoDB connection error ${error}`))

// use routes
app.use('/api/csv', csvFiles)

const port = 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`))

const readFile = require('./parsing/csvParser').readFile

readFile('Pyramid.csv')
