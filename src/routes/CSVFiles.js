const express = require('express')
const router = express.Router()


// bring in the CSVFile model
const CSVFile = require('../models/CSV')

// route to fetch all saved CSVFiles
router.get('/', (req, res) => {
  CSVFile.find()
    .then(csvFiles => res.json(csvFiles))
})

// route to add a CSVFiles
router.post('/', (req, res) => {
  const newFile = new CSVFile({
    vals: req.body.vals,
    output: req.body.output
  })

  newFile.save()
    .then(_ => res.json())
    .then(json => console.log(json))
})

module.exports = router