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
    headings: req.body.headings,
    vals: req.body.vals,
    labels: req.body.labels,
    dataType: req.body.dataType,
    size: req.body.size,
    numFeatures: req.body.numFeatures,
    missingValues: req.body.missingValues,
    missingLabels: req.body.missingLabels,
    labelsRatio: req.body.labelsRatio,
    categorical: req.body.categorical,
    complexity: req.body.complexity,
    relations: req.body.relations,
    structure: req.body.structure
  })

  newFile.save()
    .then(_ => res.json())
    .then(json => console.log(json))
})

module.exports = router