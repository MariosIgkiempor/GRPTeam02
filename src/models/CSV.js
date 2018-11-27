const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create the schema for storing CSV Files (Had8.csv and Pyramid.csv)
// vals can have any number of numbers in it
const CSVFileSchema = new Schema(
  {
    headings: [String],
    vals: [[Number]],
    labels: {},
    dataType: String,
    size: Number,
    numFeatures: Number,
    missingValues: {},
    missingLabels: {},
    labelsRatio: Number,
    categorical: Boolean,
    complexity: String,
    relations: String,
    structure: Boolean
  },
  {
    strict: false
  }
)

// create the model from the schma
const CSVFile = mongoose.model('CSVFile', CSVFileSchema)

// export CSVFile model
module.exports = CSVFile