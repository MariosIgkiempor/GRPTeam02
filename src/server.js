const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const request = require('request')
const csvFiles = require('./routes/CSVFiles')
const fs = require('fs')
<<<<<<< HEAD
const util = require('util')
=======
const util = require('util');
>>>>>>> 2d85dc84b96e33b248ec2181863d7dc7823f5d3c

// initialise express
const app = express()

// add express middleware to parse json requests
<<<<<<< HEAD
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }))
=======
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
>>>>>>> 2d85dc84b96e33b248ec2181863d7dc7823f5d3c
app.use(bodyParser())

// Allow Cross Origin Resource Sharing
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// bring in database config
const db = require('./config/config.js').mongoURI

// connect to the MongoDB databse
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log(`MongoDB connection error: ${error}`))

// use routes
app.use('/api/', csvFiles)

// port for server to run on
// might need to change this when we publish the app,
// 5000 works for development
const port = require('./config/config').port

// tell the server to listen on the port specified above
app.listen(port, () => console.log(`Server listening on port ${port}`))

// import the parseFile function
const parseFile = require('./parsing/csvParser').parseFile

// read and send the data to the database from a csv file
// csv files should be put in the ./parsing/datasets directory
// csv files should have a header line, followed by an array of values,
// the last column of the CSV should be the label

// const getFileNames = util.promisify(request)
// const filesToParse = fs.readdirSync('./parsing/datasets/')

// getFileNames(
//   {
//     uri:    `http://localhost:${port}/api/csv/names/`,
//     method: 'GET'
//   }
// )
// .then(res => {
//   parseMissingFiles(filesToParse, res.body.list)
// })
// .catch(err => console.log(`Server error: failed to get file; ${err}`))

// const parseMissingFiles = (filesToParse, dbFiles) => {
//   if (dbFiles && dbFiles.length > 0) {
//     filesToParse.forEach(x => {
//       if (dbFiles.indexOf(x) === -1) {
//         console.log(`Parsing ${x}...`)
//         parseFile(x)
//         console.log(`Successfully parsed ${x}`)
//       }
//     })
//   }
//   else filesToParse.map(x => parseFile(x))
// }

// parseFile('testing.csv')
