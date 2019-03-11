const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const request = require('request')
const csvFiles = require('./routes/CSVFiles')
const fs = require('fs')
const util = require('util')
const cors = require('cors')
const path = require('path')

// initialise express
const app = express()

// add express middleware to parse json requests
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }))
app.use(bodyParser())

// Allow Cross Origin Resource Sharing
app.options('*', cors()) // Enable preflight requests
app.use(cors())

// bring in database config
const db = require('./config/config.js').mongoURI

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

const serverURI = require('./config/config').sevrerURI
const startup = function () {
  const filesToParse = fs.readdirSync(
    path.join(__dirname, '/parsing/datasets/')
  )
  console.log(`server.startup: Files to parse: ${filesToParse}`)

  const getFileNames = util.promisify(request)
  getFileNames({
    uri: `${serverURI}:${port}/api/names/`,
    method: 'GET'
  })
    .then(res => {
      const dbFiles = JSON.parse(res.body).list
      console.log(`server.startup: Files on the database: ${dbFiles}`)
      parseMissingFiles(filesToParse, dbFiles)
    })
    .catch(err =>
      console.log(`server.startup: error: failed to get file names;\n\t ${err}`)
    )

  const parseMissingFiles = (filesToParse, dbFiles) => {
    if (!dbFiles) filesToParse.map(x => parseFile(x))
    else if (dbFiles.length > 0) {
      filesToParse.forEach(x => {
        if (dbFiles.indexOf(x) === -1) {
          console.log(`server.startup.parseMissingFiles: Parsing ${x}...`)
          parseFile(x)
          console.log(
            `server.startup.parseMissingFiles: Successfully parsed ${x}`
          )
        }
      })
    }
  }
}

// connect to the MongoDB databse
const connectionOptions = {
  socketTimeoutMS: 60000,
  useNewUrlParser: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000
}
mongoose
  .connect(db, connectionOptions, err => console.log(err))
  .then(() => {
    console.log('MongoDB connected')
    // parseFile('testing.csv')
    startup()
  })
  .catch(error => console.log(`MongoDB connection error: ${error}`))

mongoose.connection.on('error', () => console.log('MongoDB connection error'))

mongoose.connection.on('connecting', () =>
  console.log('Connecting to MongoDB...')
)
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'))
mongoose.connection.on('open', () => console.log('MongoDB connection opened'))
