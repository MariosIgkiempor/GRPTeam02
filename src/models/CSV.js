// Author: Marios Igkiempor 10335752

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create the schema for storing CSV Files
const CSVFileSchema = new Schema(
  {
    name: String, // the name of the dataset
    username: String, // the username of the user who uploaded it, or 'N/A' if the user was not logged in when uploading
    description: String, // the description of the dataset provided by the user, or 'N/A' if none was provided
    headings: [String], // the headings of each column in the dataset
    vals: [[{}]], // the values in the dataset
    originalVals: [[{}]], // if missing values were imputed, this array stores the original values
    imputedVals: [[{}]], // if missing values were imputed, this array stores the imputed values
    labels: {}, // the labels of each entry in the dataset
    dataType: String, // the data type as determined by the parsing tool ('empty', 'string', 'number' or 'boolean')
    size: Number, // the number of entries in the dataset
    numFeatures: Number, // the number of features (columns) in the dataset
    missingValues: {}, // a list of indicies of missing values in the original data
    missingLabels: {}, // a list of row indicies of missing labels in the data
    labelsRatio: Number, // a ratio of the number of rows to the number of missing labels
    isCategorical: Boolean, // boolean flag signifying if the labels represent categorical data
    isTimeSeries: Boolean, // boolean flag signifying if the user has stated that the data represents a time series
    isImageData: Boolean, // boolean flag signifying if the user has stated that the data represents an image
    complexity: Number, // a score of complexity, based on variance between columns in the dataset
    structure: Number, // a score of structure, based on the correlation of columns in the dataset
    relations: [], // a list of scores, one for each pair of columns, representing how related the two columns are based on covariance
    anomalies: {} // a list of indecies of potentially anomalous rows
  },
  { strict: false } // not all datasets will have all of the fields above. Set strict to false to allow objects uploaded to have different fields
)

// create the model from the schma
const CSVFile = mongoose.model('CSVFile', CSVFileSchema)

// export CSVFile model
module.exports = CSVFile
