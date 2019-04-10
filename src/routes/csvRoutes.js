// Author: Marios Igkiempor 10335752

const express = require('express')
const router = express.Router()
const CSVFile = require('../models/CSV') // bring in the CSVFile model

// route to fetch all saved CSVFiles
router.get('/', (req, res) => {
  CSVFile.find().then(csvFiles => res.json(csvFiles))
})

// route to save a CSVFile to the database, given an object in the requests body
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
        res.status(500)
      } else {
        console.log('Success posting document to database', ret)
        res.status(200)
      }
    }
  )
})

// Route to get the all names of files stored on the database posted by users that are not logged in
router.get('/names/', (req, res) => {
  console.log('Getting names...')
  // Find all files where the username == 'N/A' (ie the user was not logged in when posting the file)
  CSVFile.find({ username: 'N/A' }, (err, files) => {
    if (err) {
      console.error(`Error getting files: \n${err}`)
      res.status(500)
      return
    }
    let names = { list: [] }
    files.forEach(file => names.list.push(file.name))
    res.status(200)
    res.json(names)
  })
})

// Route to get all file names posted by a specific user
router.get('/names/:username', (req, res) => {
  const username = req.params.username
  console.log(`Getting names for user ${username}...`)
  CSVFile.find({ username: username }, (err, files) => {
    if (err) {
      console.error(`Error getting files: \n${err}`)
      res.status(500)
      return
    }
    let names = { list: [] }
    files.forEach(file => names.list.push(file.name))
    res.status(200)
    res.json(names)
  })
})

// Route to retreieve a file by its name
router.get('/:name', (req, res) => {
  CSVFile.find({ name: req.params.name.substring(1) }, (err, file) => {
    if (err) {
      console.log(err)
      res.status(500)
      return
    }
    console.log(file)
    res.status(200)
    res.json(file)
  })
})

// TODO: Add a delete route

module.exports = router
