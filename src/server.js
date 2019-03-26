const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const parseFile = require('./parsing/csvParser').parseFile

// Initialise express app
const app = express()

// Passport config
require('./config/passport')(passport)

// Add express middleware to parse json requests
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }))
app.use(bodyParser())

// Add express session middleware
app.use(
  session({
    secret: 'secret',
    cookie: { maxAge: 300000 },
    resave: true,
    saveUninitialized: true
  })
)

app.use(passport.initialize())
app.use(passport.session())

// Connect flash middleware
app.use(flash())

// Add express middleware to allow Cross Origin Resource Sharing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Headers', '*')
  if (req.method === 'Options') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})
app.options('*', cors()) // Enable preflight requests
app.use(cors())

// Inititialise multer with Storage Engine
const storageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'parsing', 'datasets/')) // Change upload location depending on production or development environment
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storageEngine })

// Use routes defined in an external file
const csvFileRoutes = require('./routes/csvRoutes')
const userRoutes = require('./routes/userRoutes')
app.use('/api/', csvFileRoutes)
app.use('/', userRoutes)

// Route to upload a new file
const type = upload.single('newFile')
app.post('/api/upload/', type, (req, res) => {
  console.log('router.post/upload: got', req.file)
  parseFile(req.file.filename, res)
})

// Start server listening on the port specified in the config file
const port = require('./config/config').port
app.listen(port, () => console.log(`Server listening on port ${port}`))

// connect to the MongoDB databse
// const connectionOptions = {
//   socketTimeoutMS: 60000,
//   useNewUrlParser: true,
//   keepAlive: true,
//   keepAliveInitialDelay: 300000,
//   socketOptions: { socketTimeoutMS: }
// }

const connectionOptions = {
  useNewUrlParser: true,
  poolSize: 10,
  socketTimeoutMS: 6000000,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  keepAlive: 6000000
}

const dbURI = require('./config/config.js').mongoURI

mongoose
  .connect(dbURI, connectionOptions, err => console.log(err))
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(error => console.log(`MongoDB connection error: ${error}`))
mongoose.connection.on('error', () => console.log('MongoDB connection error'))
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'))
mongoose.connection.on('open', () => console.log('MongoDB connection opened'))
