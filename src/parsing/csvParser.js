const helpers = require('../misc/helpers')
const path = require('path')
const fs = require('fs')
const R = require('ramda')
const findDataType = require('./findDataType')
const isCategorical = require('./isCategorical')
const findAnomalies = require('./findAnomalies')
const findStructure = require('./findStructure')
const findComplexity = require('./findComplexity')
const findRelations = require('./findRelations')
const CSVFile = require('../models/CSV') // bring in the CSVFile model

const CATEGORICAL_THRESHOLD = 0.25 // threshold for unique labels being considered categorical
const IMPUTE_ON = true

// takes the file out of the datasets folder and converts it to an object
// with the schema defined in ../models/CSV.js
const readFile = filename => {
  console.log(`csvParser.readFile: Reading ${filename}`)
  const location = path.join(__dirname, 'datasets/', filename)
  const fileData = fs.readFileSync(location, 'utf8')
  console.log(fileData)

  // object representation of a CSV file,
  // schema defined in ../models/CSV.js
  // schema example in data-model.txt
  const outputObject = {}

  outputObject.name = filename

  outputObject.labels = []

  // raw data from the file, including headings and labels
  // type: [[String]]
  let rawDataArray = R.pipe(
    R.trim,
    R.split('\n'),
    R.map(R.split(','))
  )(fileData)

  console.log('raw data array before description: ', rawDataArray)

  // The first two lines of the CSV file will contain the description followed
  // by whether the data is a time series, image data or neither, denoted by
  // "time", "image" or "neither" respectively
  const description = rawDataArray.splice(0, 1)[0] // Description of the dataset
  console.log('raw data array after description: ', rawDataArray)
  const type = rawDataArray.splice(0, 1)[0][0] // Type (time, image, neither, both)
  console.log(type)
  let isTimeSeries = type === 'time'
  let isImageData = type === 'image'
  if (type === 'both') isTimeSeries = isImageData = true

  outputObject.description = description
  outputObject.isTimeSeries = isTimeSeries
  outputObject.isImageData = isImageData

  // array of the headers of the csv files
  // type: [String]
  const headings = rawDataArray
    .splice(0, 1)[0] // get the first row of the data (headings)
    .slice(0, -1) // get rid of the labels heading

  outputObject.headings = headings
  outputObject.numFeatures = outputObject.headings.length

  // replace missing values with null
  rawDataArray = R.map(R.map(x => (x === '' ? null : x)))(rawDataArray)

  // array of labels
  // TODO: change pop() because it's mutating
  outputObject.labels = R.map(row => row.pop().trim())(rawDataArray)

  // array of row index of missing labels (if any)
  outputObject.missingLabels = findNullIndicies(outputObject.labels)

  // array of indecies of missing values
  // if empty, no missing values
  // missing values represented by { row:Number, col:Number }
  outputObject.missingValues = []
  rawDataArray.forEach((xs, row) =>
    findNullIndicies(xs).forEach(col =>
      outputObject.missingValues.push({ row, col })
    )
  )

  // TODO: Detect data type for labels
  outputObject.dataType = findDataType(rawDataArray)

  // parse the object's values depending on the data type
  if (outputObject.dataType === 'number') {
    outputObject.vals = R.map(R.map(parseFloat))(rawDataArray)
  } else if (outputObject.dataType === 'boolean') {
    outputObject.vals = R.map(R.map(helpers.parseBool))(rawDataArray)
  } else if (outputObject.dataType === 'string') {
    outputObject.vals = rawDataArray
  }

  // impute numbers if impute flag is toggled to true and there are missing values
  if (
    IMPUTE_ON &&
    outputObject.missingValues.length > 0 &&
    outputObject.dataType === 'number'
  ) {
    outputObject.originalVals = outputObject.vals
    outputObject.imputedVals = impute(
      outputObject.originalVals,
      outputObject.missingValues
    )
    outputObject.vals = outputObject.imputedVals
  }

  outputObject.size = outputObject.vals.length
  outputObject.labelsRatio = outputObject.labels.length / outputObject.size

  outputObject.isCategorical = isCategorical(
    outputObject.labels,
    CATEGORICAL_THRESHOLD
  )
  if (outputObject.isCategorical) {
    outputObject.categories = helpers.createUniqueArray(outputObject.labels)
  }

  // measure of structure is a number -1 to 1, where -1 is little/no structure and 1 is very structured
  // structure here means how the values of the features increase relative to each other
  // ie the average correlation coefficient between all pairs of columns in dataset
  // measure of complexity is an average of the bias-corrected sample variances of each column
  if (outputObject.dataType === 'number') {
    // complexity/structure/anomalies can only be detected for numbers
    outputObject.structure = findStructure(outputObject.vals)
    outputObject.complexity = findComplexity(outputObject.vals)
    outputObject.anomalies = findAnomalies(outputObject.vals)
    outputObject.relations = findRelations(outputObject.vals)
  }

  // console.log(outputObject)

  return outputObject
}

// helper function that return array of all indicies that match predicate f
const findMatchingIndicies = f => xs =>
  xs.map((x, i) => (f(x) ? i : null)).filter(x => x !== null)

const findNullIndicies = findMatchingIndicies(x => x === null)

const impute = (arr, missingIndicies) => {
  const cols = R.transpose(arr)
  const means = cols.map(xs => R.mean(xs))
  const filled = arr.map((xs, row, o) =>
    xs.map((_, col) =>
      R.contains({ row, col }, missingIndicies) ? means[col] : o[row][col]
    )
  )
  return filled
}

const sendData = function (o) {
  CSVFile.create(
    {
      name: o.name,
      description: o.description,
      headings: o.headings,
      vals: o.vals,
      originalVals: o.originalVals,
      imputedVals: o.imputedVals,
      labels: o.labels,
      dataType: o.dataType,
      size: o.size,
      numFeatures: o.numFeatures,
      missingValues: o.missingValues,
      missingLabels: o.missingLabels,
      labelsRatio: o.labelsRatio,
      isCategorical: o.isCategorical,
      isTimeSeries: o.isTimeSeries,
      isImageData: o.isImageData,
      categories: o.categories,
      complexity: o.complexity,
      relations: o.relations,
      structure: o.structure,
      anomalies: o.anomalies
    },
    function (err, ret) {
      if (err) {
        console.log('router.post/ : error saving document', err)
        return false
      } else {
        console.log('Success posting document to database', ret)
        return true
      }
    }
  )
}

module.exports = {
  parseFile: function (filename, res) {
    console.log('csvParser.parseFile: Parsing ', filename)
    const fileObject = readFile(filename)
    console.log('csvParser.parseFile: Finished parsing, sending ', filename)
    const sent = sendData(fileObject)
    if (sent) {
      res.send(200)
    } else {
      res.send(500)
    }
    console.log('csvParser.parseFile: Finished sending ', filename)
  },

  // Export functions for testing purposes
  isCategorical,
  findMatchingIndicies,
  findAnomalies
}

// suggest whether to impute/remove rows/cols
// computability
// categories/subcategories
// detecting temporal drift in the dataset
// convert time to UNIX time
