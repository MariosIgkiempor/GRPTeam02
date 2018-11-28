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
  
  outputObject.size = outputObject.vals.length
  console.log(outputObject)

  // TODO: Detect data type for vals and labels
  // for now, it is assumed all data will be numbers
  // outputObject.dataType = findDataType(outputObject)

  // outputObject.labelsRatio = outputObject.labels.length / outputObject.size

  outputObject.anomalies = findAnomalies(rawDataArray)
  // console.log(outputObject.anomalies)

  return outputObject
}

const findMatchingIndicies = f => xs => xs
  .map((x, i) => f(x) ? i : null)
  .filter(x => x !== null)

const findMissingIndicies = findMatchingIndicies(x => x === null)

const findAnomalies = arr => {
  let vals = []
    .concat(...arr)         // flatten the input array
    .filter(x => x != null) // get rid of null values
    .sort((a,b) => a-b)     // sort lowest to highest

  // find interquartile range
  let n = vals.length
  const median = (l, r) => Math.floor(((r - l + 1) + 1) / 2 - 1)
  let medianIndex = median(0, n)
  let q1Arr = vals.slice(0, medianIndex)
  let q3Arr = vals.slice(medianIndex + 1)
  // console.log(vals[medianIndex], q1Arr, q3Arr)
  let q1 = q1Arr[median(0, q1Arr.length)]

  // console.log(`Q1: ${q1}`)
  let q3 = q3Arr[median(0, q3Arr.length)]

  // console.log(`Q3: ${q3}`)
  let iqr = q3 - q1
  // console.log(`IQR: ${iqr}`)

  const isAnomaly = x => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr

  console.log(arr)
  let anomalies = []
  arr.forEach((xs, row) => {
    xs.map(parseFloat)
      .map((x, i) => isAnomaly(x) ? i : null)
      .forEach(x => console.log(x))
      // .filter(x => x !== null)
      // .forEach(col => anomalies.push({ row, col }))
    }
  )
  
  console.log(anomalies)
  return anomalies
}

const findDataType = obj => {
  const vals = obj.vals
  let dataType = typeof vals[0][0]
  for (let y = 0; y < vals.length; y++) {
    for (let x = 0; x < vals[y].length; x++) {
      if (vals[y][x] !== null) {
        dataType = dataType === typeof vals[y][x]
          ? dataType
          : "mixed"
      }
      if (dataType === "mixed") return dataType;
    }
  }
  return dataType
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