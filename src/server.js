const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const request = require('request')
const fs = require('fs')
const util = require('util')
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const production = require('./config/config').production

// Initialise express app
const app = express()

// Add express middleware to parse json requests
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }))
app.use(bodyParser())

// Add express middleware to allow Cross Origin Resource Sharing
app.options('*', cors()) // Enable preflight requests
app.use(cors())

// Inititialise multer with Storage Engine
const storageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, production ? '/tmp/upload' : './src/parsing/datasets/') // Change upload location depending on production or development environment
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storageEngine })

// Use routes defined in an external file
const csvFileRoutes = require('./routes/CSVFiles')
app.use('/api/', csvFileRoutes)

// Route to upload a new file
const type = upload.single('newFile')
app.post('/api/upload/', type, (req, res) => {
  console.log('router.post/upload: got', req.file)
  parseFile(req.file.filename)
})

// Start server listening on the port specified in the config file
const port = require('./config/config').port
app.listen(port, () => console.log(`Server listening on port ${port}`))

const serverURI = require('./config/config').sevrerURI
const parseFile = require('./parsing/csvParser').parseFile
// Function that will run every time the sever starts,
// Will upload all files in the ./parsin/datasets folder whose
// names aren't one of the names of any file on the database
const startup = function () {
  // Read file names of files in the ./parsing/datasets folder
  const filesToParse = fs.readdirSync(
    path.join(__dirname, '/parsing/datasets/')
  )
  console.log(`server.startup: Files to parse: ${filesToParse}`)

  // Get file names of files on the server
  const getFileNames = util.promisify(request)
  getFileNames({
    uri: `${serverURI}:${port}/api/names`,
    method: 'GET'
  })
    .then(res => {
      console.log(res.body)
      const dbFiles = JSON.parse(res.body).list
      console.log(`server.startup: Files on the database: ${dbFiles}`)
      parseMissingFiles(filesToParse, dbFiles)
    })
    .catch(err =>
      console.log(
        `server.startup: error: failed to get file names from database;\n\t ${err}`
      )
    )

  // For each file that doesn't exist in the database, parse and upload it
  // using the parsefiles function
  const parseMissingFiles = (filesToParse, dbFiles) => {
    console.log(
      `server.startup.parseMissingFiles: files received from db: \n${dbFiles}`
    )
    // if (!dbFiles) filesToParse.map(x => parseFile(x))
    // else if (dbFiles.length > 0) {
    filesToParse.forEach(x => {
      if (!dbFiles || dbFiles.indexOf(x) === -1) {
        console.log(`server.startup.parseMissingFiles: Parsing ${x}...`)
        parseFile(x)
        console.log(
          `server.startup.parseMissingFiles: Successfully parsed ${x}`
        )
      }
    })
    // }
  }
}

// connect to the MongoDB databse
const connectionOptions = {
  socketTimeoutMS: 60000,
  useNewUrlParser: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000
}
const dbURI = require('./config/config.js').mongoURI

mongoose
  .connect(dbURI, connectionOptions, err => console.log(err))
  .then(() => {
    console.log('MongoDB connected')
    // parseFile('testing.csv')
    startup()
  })
  .catch(error => console.log(`MongoDB connection error: ${error}`))
mongoose.connection.on('error', () => console.log('MongoDB connection error'))
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'))
mongoose.connection.on('open', () => console.log('MongoDB connection opened'))
