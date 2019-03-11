const express = require('express')
const router = express.Router()
const CSVFile = require('../models/CSV') // bring in the CSVFile model
const multer = require('multer')
// Config flag to specify whether the app is in production or development
const production = require('../config/config').production
const uploadLocation = production ? '/tmp/uploads' : '../parsing/datasets/'
const upload = multer({ dest: uploadLocation })
const { parseFile } = require('../parsing/csvParser')

// router.use(CSVFile)

// route to fetch all saved CSVFiles
router.get('/', (req, res) => {
  CSVFile.find().then(csvFiles => res.json(csvFiles))
})

// route to upload a new file
router.post('/upload', upload.single('file'), (req, res) => {
  parseFile(req.file.filename)
})

// route to save a CSVFile to the database
router.post('/', upload.single('file'), (req, res) => {
  const newFile = new CSVFile({
    name: req.body.name,
    headings: req.body.headings,
    vals: req.body.vals,
    originalVals: req.body.originalVals,
    imputedVals: req.body.imputedVals,
    labels: req.body.labels,
    dataType: req.body.dataType,
    size: req.body.size,
    numFeatures: req.body.numFeatures,
    missingValues: req.body.missingValues,
    missingLabels: req.body.missingLabels,
    labelsRatio: req.body.labelsRatio,
    isCategorical: req.body.isCategorical,
    categories: req.body.categories,
    complexity: req.body.complexity,
    relations: req.body.relations,
    structure: req.body.structure,
    anomalies: req.body.anomalies
  })
  newFile
    .save()
    .then(_ => res.json())
    .then(json => console.log(json))
})

router.get('/names/', (req, res) => {
  console.log('Getting names...')
  CSVFile.find({}, (err, files) => {
    if (err) {
      console.error(`Error getting files: \n${err}`)
      return
    }
    let names = { list: [] }
    files.forEach(file => names.list.push(file.name))
    res.json(names)
  })
})

router.get('/:name', (req, res) => {
  CSVFile.find({ name: req.params.name.substring(1) }, (err, file) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(file)
    res.json(file)
  })
})

module.exports = router
