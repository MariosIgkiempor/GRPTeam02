require('../misc/helpers')
const fs = require('fs')
const request = require('request')

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
    .splice(0, 1)[0]
    .slice(0, -1)
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

  if (outputObject.dataType === "number") 
    outputObject.vals = rawDataArray.map(xs => xs.map(parseFloat))
  else if (outputObject.dataType === "boolean")
    outputObject.vals = rawDataArray.map(xs => xs.map(parseBool))
  else if (outputObject.dataType === "string")
    outputObject.vals = rawDataArray
    
  
  outputObject.size = outputObject.vals.length
  outputObject.labelsRatio = outputObject.labels.length / outputObject.size
  
  console.log(outputObject)

  return outputObject
}

const parseBool = x => x === '1' ? true : false

const findMatchingIndicies = f => xs => xs
  .map((x, i) => f(x) ? i : null)
  .filter(x => x !== null)

const findMissingIndicies = findMatchingIndicies(x => x === null)

const findAnomalies = arr => {
  let vals =
     flatten(arr)            // flatten the input array
    .map(x => parseFloat(x)) // temporary
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

  // temporary; only numbers will parsed using this function
  vals = arr.map(xs => xs.map(ys => parseInt(ys)))

  vals.forEach((xs, row) => {
    xs.map((x, i) => isAnomaly(q1, q3, iqr, x) ? i : null)
      .filter(x => x != null)
      .forEach(col => anomalies.push({ row, col }))
    }
  )
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
    parsedNumbers.reduce((a, x) => a && (x === 1 || x === 0), true)
  if (isBoolean) return "boolean"
  else if (isNumber) return "number"
  else return "string" // if not boolean, dataType is assumed to be a String
}

const isCategorical = obj => {

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
        "categorical": elem.categorical,
        "complexity": elem.complexity,
        "relations": elem.relations,
        "structure": elem.structure,
        "anomalies": elem.anomalies
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