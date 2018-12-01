require('../misc/helpers')
const fs = require('fs')
const request = require('request')

const CATEGORICAL_THRESHOLD = 0.25 // threshold for unique labels being considered categorical

// TODO: missing values - what to fill them with

// takes the file out of the datasets folder and converts it to an object
// with the schema defined in ../models/CSV.js
const readFile = filename => {
  const fileData = fs.readFileSync(`${__dirname}/datasets/${filename}`, 'utf8')

  // object representation of a CSV file,
  // schema defined in ../models/CSV.js
  // schema example in data-model.txt
  const outputObject = {}

  // values in the CSV file
  // type: [[Value (Number/String)]]
  outputObject.vals = []

  outputObject.labels = []

  // raw data from the file, including headings and labels
  // type: [[String]]
  let rawDataArray = fileData
    .trim()
    .split('\r\n')
    .map(e => e.split(','))

  // array of the headers of the csv files
  // type: [String]
  const headings = rawDataArray
    .splice(0, 1)[0] // get the first row of the data (headings)
    .slice(0, -1)    // get rid of the labels heading
  outputObject.headings = headings
  outputObject.numFeatures = outputObject.headings.length
  
  // replace missing values with null
  rawDataArray = rawDataArray.map(row => 
    row.map(x => x === '' ? null : x)
  )

  // array of labels
  outputObject.labels = rawDataArray.map(row => row.pop())

  // array of row index of missing labels (if any)
  outputObject.missingLabels = findMissingIndicies(outputObject.labels)
  
  // array of indecies of missing values
  // if empty, no missing values
  // missing values represented by { row:Number, col:Number }
  outputObject.missingValues = []
  rawDataArray.map((xs, row) => 
    findMissingIndicies(xs)
      .forEach(col => outputObject.missingValues.push({ row, col }))
  )

  // TODO: Detect data type for labels
  outputObject.dataType = findValsDataType(rawDataArray)
  
  if (outputObject.dataType === "number") // only find anomalies if data is numbers
    outputObject.anomalies = findAnomalies(rawDataArray)

  // parse the object's values depending on the data type
  if (outputObject.dataType === "number") 
    outputObject.vals = rawDataArray.map(xs => xs.map(parseFloat))
  else if (outputObject.dataType === "boolean")
    outputObject.vals = rawDataArray.map(xs => xs.map(parseBool))
  else if (outputObject.dataType === "string")
    outputObject.vals = rawDataArray
    
  outputObject.size = outputObject.vals.length
  outputObject.labelsRatio = outputObject.labels.length / outputObject.size
  
  outputObject.isCategorical = isCategorical(outputObject.labels, CATEGORICAL_THRESHOLD)
  if (outputObject.isCategorical) outputObject.categories = findUnique(outputObject.labels)

  // measure of structure is a number -1 to 1, where -1 is little/no structure and 1 is very structured
  // structure here means how the values of the features increase relative to each other
  // ie the average correlation coefficient between all pairs of columns in dataset

  // measure of complexity is an average of the bias-corrected sample variances of each column
  if (outputObject.dataType === "number") { // complexity/structure can only be detected for numbers
    outputObject.structure  = findStructure(outputObject.vals)
    outputObject.complexity = findComplexity(outputObject.vals)
  }

  // console.log(outputObject)

  return outputObject
}

const isCategorical = (labels, threshold) => {
  if (findValsDataType(labels) === "boolean") return true // booleans are categorical by default

  const uniqueCount = findUnique(labels).length
  let categorical =
    (uniqueCount > labels.length * threshold)
      ? false // if all labels are numbers but more than a constant ratio of the labels are unique, assume values
      : true  // if all lavels are numbers and less than a constant ratio of the labels are unique, assume categories
  
  return categorical 
}

const findUnique = xs => [...new Set(xs)] // sets only allow unique values (ie categories)

const parseBool = x => x === '1' ? true : false // assume 

// helper function that return array of all indicies that match predicate f
const findMatchingIndicies = f => xs => xs
  .map((x, i) => f(x) ? i : null)
  .filter(x => x !== null)

const findMissingIndicies = findMatchingIndicies(x => x === null)

const findAnomalies = arr => {
  // TODO: more robust anomaly checking
  const vals =
    flatten(arr)             // flatten the input array
    .map(x => parseFloat(x)) // parse as numbers (this method will only be called with numbers)
    .filter(x => x !== null) // get rid of null values
    .sort((a,b) => a-b)      // sort lowest to highest

  // ------------ find interquartile range ------------
  let n = vals.length
  const median = (l, r) => // median of a sorted array is the element in the middle
    Math.floor(((r - l + 1) + 1) / 2 - 1)
  const medianIndex = median(0, n)
  const q1Arr       = vals.slice(0, medianIndex)     // first half of sorted values
  const q3Arr       = vals.slice(medianIndex + 1)    // last half of sorted vals
  const q1          = q1Arr[median(0, q1Arr.length)] // first quartile
  const q3          = q3Arr[median(0, q3Arr.length)] // third quartile
  const iqr         = q3 - q1                        // interquartile range

  // anomaly is any value less than 1.5 times the IQR
  //                   or more than 1.5 times the IQR
  const isAnomaly = (q1, q3, iqr, x) => x < (q1 - 1.5 * iqr) || x > (q3 + 1.5 * iqr)

  let anomalies = []

  arr
    .map(xs => xs.map(ys => parseFloat(ys)))                 // read all input values as numbers
    .forEach((xs, row) =>                                    // for each row of input values
      xs.map((x, i) => isAnomaly(q1, q3, iqr, x) ? i : null) // check which indecies are anomalies
        .filter(x => x != null)                              // filter out indecies that aren't anomalies
        .forEach(col => anomalies.push({ row, col })))       // push to anomalies array the row and col its found on in the input array

  return anomalies
}

const findValsDataType = arr => {
  const vals = flatten(arr).filter(x => x !== null)
  if (vals.length === 0) return "empty"

  const parsedNumbers = vals.map(x => parseFloat(x))
  const isNumber = parsedNumbers.every(x => !isNaN(x))

  // if all numbers are 1 or 0, dataType is boolean
  const isBoolean = // values are boolean if all values are 1 or 0
      isNumber &&
    ( parsedNumbers.every(x => x === 1 || x ===  0) ||
      parsedNumbers.every(x => x === 1 || x === -1) )

  if (isBoolean) return "boolean"
  else if (isNumber) return "number"
  else return "string" // if not boolean, dataType is assumed to be a String
}

const findComplexity = arr => {
  // TODO: Shannon Entropy!! for complexity
  // TODO: missing values
  // TODO: anomalies
  // or ask the user
  // how chaotic single values are

  let totalVariance = 0
  // s = (1/N-1)(sum((X-Mx)^2))
  const columns = transpose(arr)
  const means   = columns.map(mean)
  columns.forEach((xs,i) => {
    const diff        = xs.map(x => x - means[i])  // X - Mx
    const diffSquared = diff.map(x => power(2)(x)) // (X - Mx)^2
    const sumXs       = sum(diffSquared)           // sum((X - Mx)^2)
    const s           = sumXs / (xs.length - 1)    // bias-corrected variance
    totalVariance += s
  })

  const averageVariance = totalVariance / columns.length
  // log(averageVariance)
  return averageVariance
}

const findStructure = arr => {
  // TODO: missing values
  // TODO: ignore anomalies
  // "structure" is the correlation between all columns of a dataset
  // average of correlation coefficients between all columns
  let totalCorrelationCoefficient = 0
  const columns = transpose(arr)

  // cretae pairs of all columns
  const pairs = columns.reduce((acc, val, i1) => 
    [
      ...acc,
      ...new Array(columns.length - 1 - i1).fill(0)
        .map((v, i2) => ([columns[i1], columns[i1 + 1 + i2]]))
    ], [])
  
  // calculate population coefficient of each pair of columns
  // r = mean((X - Mx) * (Y - My)) / (sqrt(mean((X - Mx)^2)) * sqrt(mean((Y - My)^2)))
  // where X  and Y  are the values in each column
  //   and Mx and My are the means of each column
  pairs.forEach(pair => {
    const meanX     = mean(pair[0])                  // Mx
    const meanY     = mean(pair[1])                  // My
    const xs        = pair[0].map(x => x - meanX)    // X - Mx
    const ys        = pair[1].map(y => y - meanY)    // Y - My
    const xsys      = xs.map((x, i) => x * ys[i])    // (X - Mx)(Y - My)
    const num       = mean(xsys)                     // mean((X - Mx)(Y - My))
    const MxsSqared = mean(xs.map(x => power(2)(x))) // mean((X - Mx) ^ 2)
    const MysSqared = mean(ys.map(y => power(2)(y))) // mean((Y - My) ^ 2)
    const den1      = power(0.5)(MxsSqared)          // sqrt(sum(X - Mx)^2)
    const den2      = power(0.5)(MysSqared)          // sqrt(sum(Y - My)^2)
    const r         = num / (den1 * den2)            // correlation coefficient
    totalCorrelationCoefficient += r
  })
  
  // high average correlation between columns means high structure in the dataset
  const structure = totalCorrelationCoefficient / pairs.length
  return structure
}

// send a POST request to the server on port declared in the config file
const sendData = elem => {
  const port = require('../config/config').port
    const options = {
      uri: `http://localhost:${port}/api/csv`,
      method: 'POST',
      json: {
        "headings": elem.headings,
        "vals": elem.vals,
        "labels": elem.labels,
        "dataType": elem.dataType,
        "size": elem.size,
        "numFeatures": elem.numFeatures,
        "missingValues": elem.missingValues,
        "missingLabels": elem.missingLabels,
        "labelsRatio": elem.labelsRatio,
        "isCategorical": elem.isCategorical,
        "categories": elem.categories ? elem.categories : null,
        "complexity": elem.complexity,
        "relations": elem.relations,
        "structure": elem.structure,
        "anomalies": elem.anomalies,
      }
    }

    request(options, (error, response, body) => {
      if (error) console.log(`Error posting to the database: ${error}`)
      else console.log(`Posted to the database; response code ${response.statusCode}`)
    })
}

// const sendData = csvObject => console.log(JSON.stringify(csvObject, ' ', 2))

module.exports = {
  parseFile: filename => {
    const fileArray = readFile(filename)
    // sendData(fileArray)
  }
}