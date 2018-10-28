const express = require('express')
const router = express.Router()


// bring in the CSVFile model
const CSVFile = require('../models/CSV')

// route to fetch all saved CSVFiles
router.get('/', (req, res) => {
  CSVFile.find()
    .then(csvFiles => res.json(csvFiles))
})

module.exports = router