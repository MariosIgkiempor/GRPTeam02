const helpers = require('../misc/helpers')
const path = require('path')
const fs = require('fs')
const request = require('request')
const R = require('ramda')
const findDataType = require('./findDataType')
const isCategorical = require('./isCategorical')
const findAnomalies = require('./findAnomalies')
const findStructure = require('./findStructure')
const findComplexity = require('./findComplexity')

const CATEGORICAL_THRESHOLD = 0.25 // threshold for unique labels being considered categorical
const IMPUTE_ON = true

// takes the file out of the datasets folder and converts it to an object
// with the schema defined in ../models/CSV.js
const readFile = filename => {
  console.log(`csvParser.readFile: Reading ${filename}`)
  const location = path.join(__dirname, 'datasets/', filename)
  const fileData = fs.readFileSync(location, 'utf8')

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
    R.split('\r\n'),
    R.map(R.split(','))
  )(fileData)

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
  outputObject.labels = R.map(row => row.pop())(rawDataArray)

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

const serverURI = require('../config/config').sevrerURI

// send a POST request to the server on port declared in the config file
const sendData = o => {
  const port = require('../config/config').port
  const options = {
    uri: `${serverURI}:${port}/api/`,
    method: 'POST',
    json: {
      name: o.name,
      headings: o.headings,
      vals: o.vals,
      originalVals: o.originalVals ? o.originalVals : null,
      imputedVals: o.imputedVals ? o.imputedVals : null,
      labels: o.labels,
      dataType: o.dataType,
      size: o.size,
      numFeatures: o.numFeatures,
      missingValues: o.missingValues,
      missingLabels: o.missingLabels,
      labelsRatio: o.labelsRatio,
      isCategorical: o.isCategorical,
      categories: o.categories ? o.categories : null,
      complexity: o.complexity ? o.complexity : null,
      relations: o.relations ? o.relations : null,
      structure: o.structure ? o.structure : null,
      anomalies: o.anomalies ? o.anomalies : null
    },
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
    }
  }

  console.log(`csvParser.sendData: sending ${o.name} to db...`)
  request(options, (error, response, body) => {
    if (error) {
      console.log(
        `cavParser.sendData: error posting new file to database: ${error}`
      )
    } else {
      console.log(
        `Posted to the database; response code ${response.statusCode}`
      )
    }
  })
  console.log(`csvParser.sendData: finished sending ${o.name} to db`)
}

module.exports = {
  parseFile: filename => {
    console.log('csvParser.parseFile: Parsing ', filename)
    const fileObject = readFile(filename)
    sendData(fileObject)
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
