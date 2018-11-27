const express = require('express')
const mongoose = require('mongoose')

const csvFiles = require('./routes/CSVFiles')

// initialise express
const app = express()

// add express middleware to parse json requests
app.use(express.json())

// bring in database config
const db = require('./config/config.js').mongoURI

// connect to the MongoDB databse
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log(`MongoDB connection error: ${error}`))

// use routes
app.use('/api/csv', csvFiles)

// port for server to run on
// might need to change this when we publish the app,
// 5000 works for development
const port = require('./config/config').port;

// tell the server to listen on the port specified above
app.listen(port, () => console.log(`Server listening on port ${port}`))

// import the parseFile function
const parseFile = require('./parsing/csvParser').parseFile

// read and send the data to the database from a csv file
// csv files should be put in the ./parsing/datasets directory
// csv files should have a header line, followed by an array of numbers,
// the last column of the CSV should be a boolean true/false

parseFile('testing.csv')
// console.log(parsedArray)
