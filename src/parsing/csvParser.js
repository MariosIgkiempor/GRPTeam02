const helpers = require('../misc/helpers')
const fs = require('fs')
const request = require('request')
const R = require('ramda')

const CATEGORICAL_THRESHOLD = 0.25 // threshold for unique labels being considered categorical
const IMPUTE_ON = true

// takes the file out of the datasets folder and converts it to an object
// with the schema defined in ../models/CSV.js
const readFile = filename => {
  const fileData = fs.readFileSync(`${__dirname}/datasets/${filename}`, 'utf8')

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
  outputObject.dataType = findValsDataType(rawDataArray)

  // parse the object's values depending on the data type
  if (outputObject.dataType === 'number') {
    outputObject.vals = R.map(R.map(parseFloat))(rawDataArray)
  } else if (outputObject.dataType === 'boolean') {
    outputObject.vals = R.map(R.map(parseBool))(rawDataArray)
  } else if (outputObject.dataType === 'string') { outputObject.vals = rawDataArray }

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
    outputObject.categories = findUnique(outputObject.labels)
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

  console.log(outputObject)

  return outputObject
}

const isCategorical = (labels, threshold) => {
  if (findValsDataType(labels) === 'boolean') return true // booleans are categorical by default

  const uniqueCount = R.length(findUnique(labels))
  let categorical = !(uniqueCount > labels.length * threshold) // if all lavels are numbers and less than a constant ratio of the labels are unique, assume categories

  return categorical
}

const findUnique = xs => [...new Set(xs)] // sets only allow unique values (ie categories)

const parseBool = x => x === '1' // assuming only numbers

// helper function that return array of all indicies that match predicate f
const findMatchingIndicies = f => xs =>
  xs.map((x, i) => (f(x) ? i : null)).filter(x => x !== null)

const findNullIndicies = findMatchingIndicies(x => x === null)

// finds and returns the indicies of anomalous data
// anomalies are found on a per-feature basis (ie anomalies are found down a column)
const findAnomalies = arr => {
  const median = (
    l,
    r // median of a sorted array is the element in the middle
  ) => Math.floor((r - l + 1 + 1) / 2 - 1)

  // anomaly is any value less than 1.5 times the IQR
  //                   or more than 1.5 times the IQR
  const isAnomaly = (q1, q3, iqr, x) => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr

  // finds the first and third quartiles and the interquartile range
  // and returns the values as an object
  const quartiles = xs => {
    let n = xs.length
    const medianIndex = median(0, n)
    const q1Arr = xs.slice(0, medianIndex) // first half of sorted values
    const q3Arr = xs.slice(medianIndex + 1) // last half of sorted values
    const q1 = q1Arr[median(0, q1Arr.length)] // first quartile
    const q3 = q3Arr[median(0, q3Arr.length)] // third quartile
    const iqr = q3 - q1 // interquartile range
    return { q1, q3, iqr }
  }

  const cols = R.transpose(arr)
  const colsSorted = R.map(helpers.qSort)(cols)
  const colsQuartlies = R.map(quartiles)(colsSorted)

  let anomalies = []
  let q1, q3, iqr
  arr.forEach((xs, row) => {
    // for each row of data
    xs.forEach((x, col) => {
      // for each column of a row
      ;({ q1, q3, iqr } = colsQuartlies[col]) // get the quartiles and inter-quartile range for that column
      if (isAnomaly(q1, q3, iqr, x)) {
        anomalies.push({ row, col })
      } // add it to the anomalies list
    })
  })

  return anomalies
}

const findValsDataType = arr => {
  const vals = R.flatten(arr).filter(x => x !== null)
  if (vals.length === 0) return 'empty'

  const parsedNumbers = R.map(parseFloat)(vals)
  const isNumber = parsedNumbers.every(x => !isNaN(x))

  // if all numbers are 1 or 0, dataType is boolean
  const isBoolean = // values are boolean if all values are all (1 or 0) or (1 or -1)
    isNumber &&
    (R.all(R.either(R.equals(1), R.equals(0)))(parsedNumbers) ||
      R.all(R.either(R.equals(1), R.equals(-1)))(parsedNumbers))

  if (isBoolean) return 'boolean'
  else if (isNumber) return 'number'
  else return 'string' // if not boolean, dataType is assumed to be a String
}

const findComplexity = arr => {
  // TODO: Shannon Entropy!! for complexity
  // TODO: missing values
  // TODO: anomalies
  // or ask the user
  // how chaotic single values are

  let totalVariance = 0
  // s = (1/N-1)(sum((X-Mx)^2))
  const columns = R.transpose(arr)
  const means = R.map(R.mean)(columns)
  columns.forEach((xs, i) => {
    const diff = R.map(x => x - means[i])(xs) // X - Mx
    const diffSquared = R.map(helpers.power(2))(diff) // (X - Mx)^2
    const sumXs = R.sum(diffSquared) // sum((X - Mx)^2)
    const s = sumXs / (xs.length - 1) // bias-corrected variance
    totalVariance += s
  })

  const averageVariance = totalVariance / columns.length
  return averageVariance
}

const findStructure = arr => {
  // TODO: missing values
  // TODO: ignore anomalies
  // "structure" is the correlation between all columns of a dataset
  // average of correlation coefficients between all columns
  let totalCorrelationCoefficient = 0
  const columns = R.transpose(arr)

  // create pairs of all columns
  const pairs = columns.reduce(
    (acc, val, i1) => [
      ...acc,
      ...new Array(columns.length - 1 - i1)
        .fill(0)
        .map((v, i2) => [columns[i1], columns[i1 + 1 + i2]])
    ],
    []
  )

  // calculate population coefficient of each pair of columns
  // r = mean((X - Mx) * (Y - My)) / (sqrt(mean((X - Mx)^2)) * sqrt(mean((Y - My)^2)))
  // where X  and Y  are the values in each column
  //   and Mx and My are the means of each column
  pairs.forEach(pair => {
    const meanX = R.mean(pair[0]) // Mx
    const meanY = R.mean(pair[1]) // My
    const xs = R.map(x => x - meanX)(pair[0]) // X - Mx
    const ys = R.map(y => y - meanY)(pair[1]) // Y - My
    const xsys = xs.map((x, i) => x * ys[i]) // (X - Mx)(Y - My)
    const num = R.mean(xsys) // mean((X - Mx)(Y - My))
    const MxsSqared = R.mean(R.map(helpers.power(2))(xs)) // mean((X - Mx) ^ 2)
    const MysSqared = R.mean(R.map(helpers.power(2))(ys)) // mean((Y - My) ^ 2)
    const den1 = helpers.power(0.5)(MxsSqared) // sqrt(sum(X - Mx)^2)
    const den2 = helpers.power(0.5)(MysSqared) // sqrt(sum(Y - My)^2)
    const r = num / (den1 * den2) // correlation coefficient
    totalCorrelationCoefficient += r
  })

  // high average correlation between columns means high structure in the dataset
  const structure = totalCorrelationCoefficient / pairs.length
  return structure
}

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
    uri: `${serverURI}:${port}/api/csv`,
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
    }
  }

  request(options, (error, response, body) => {
    if (error) console.log(`Error posting to the database: ${error}`)
    else {
      console.log(
        `Posted to the database; response code ${response.statusCode}`
      )
    }
  })
}

// const sendData = csvObject => console.log(JSON.stringify(csvObject, ' ', 2))

module.exports = {
  parseFile: filename => {
    const fileObject = readFile(filename)
    // sendData(fileObject)
  }
}
