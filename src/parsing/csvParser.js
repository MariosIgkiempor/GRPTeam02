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
  // type: [String]
  const rawDataArray = fileData.trim().split('\r\n')

  // array of the headers of the csv files
  // type: [String]
  const headings = rawDataArray.shift().split(',')
  headings.splice(-1, 1)
  outputObject.headings = headings
  outputObject.numFeatures = outputObject.headings.length
  
  // array of indecies of missing values
  // if empty, no missing values
  // missing values represented by { x:Number, y:Number }
  outputObject.missingValues = []

  // array of row index of missing label
  // if empty, no missing label
  outputObject.missingLabels = []


  rawDataArray.forEach((elem, row) => {
    let cols = elem.split(',')

    const label = cols.pop()
    // find and append missing values to missingValues array
    cols.forEach((e, col) => {
      if (e == '') outputObject.missingValues.push({ x: row, y: col })
    })

    if (!label || label === '') outputObject.missingLabels.push(row)
    else outputObject.labels.push(label)

    cols = cols.map(value => value === '' ? null : parseFloat(value))

    outputObject.vals.push(cols)
  })

  outputObject.size = outputObject.vals.length


  // TODO: Detect data type for vals and labels
  // for now, it is assumed all data will be numbers
  outputObject.dataType = "Number"
  outputObject.labelsRatio = outputObject.labels.length / outputObject.size

  // findAnomalies(outputObject)

  return outputObject
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
        "structure": elem.structure
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
    sendData(fileArray)
  }
}