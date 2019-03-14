const express = require('express')
const router = express.Router()
const CSVFile = require('../models/CSV') // bring in the CSVFile model

// route to fetch all saved CSVFiles
router.get('/', (req, res) => {
  CSVFile.find().then(csvFiles => res.json(csvFiles))
})

// route to save a CSVFile to the database
router.post('/', (req, res) => {
  console.log('rouer.post/: got ', req.body.name)
  CSVFile.create(
    {
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
    },
    function (err, ret) {
      if (err) {
        console.log('router.post/ : error saving document', err)
        res.send(500)
      } else {
        console.log('Success posting document to database', ret)
        res.send(200)
      }
    }
  )
})

router.get('/names/', (req, res) => {
  console.log('Getting names...')
  CSVFile.find({}, (err, files) => {
    if (err) {
      console.error(`Error getting files: \n${err}`)
      res.send(500)
      return
    }
    let names = { list: [] }
    files.forEach(file => names.list.push(file.name))
    res.json(names)
    res.send(200)
  })
})

router.get('/:name', (req, res) => {
  CSVFile.find({ name: req.params.name.substring(1) }, (err, file) => {
    if (err) {
      console.log(err)
      res.send(500)
      return
    }
    console.log(file)
    res.json(file)
    res.send(200)
  })
})

module.exports = router
