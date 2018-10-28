const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create the schema for storing CSV Files Had8.csv and Pyramid.csv
const CSVFileSchema = new Schema(
  {
    vals: [Number],
    output: Boolean
  }
)

// create the model from the schma
const CSVFile = mongoose.model('CSVFile', CSVFileSchema)

// export CSVFile model
module.exports = CSVFile