const fs = require('fs')
const request = require('request')

// takes the file out of the datasets folder and converts it to an array of objects
// with the schema { outputs: Boolean, values: [Integer] } as required by the CSVFiles
// model of the MongoDB database
const readFile = filename => {
  const fileData = fs.readFileSync(`${__dirname}/datasets/${filename}`, 'utf8')

  const dataArray = fileData.trim().split('\r\n')
  dataArray.shift()

  const array = []
  dataArray.forEach((elem, index) => {
    let valuesArray = elem.split(',')
    const obj = {}
    obj['output'] = JSON.parse(valuesArray.pop().toLowerCase())
    valuesArray = valuesArray.map(value => parseInt(value))
    obj['vals'] = valuesArray
    array.push(obj)
  })

  return array
}

const sendData = arr => {
  arr.forEach((elem) => {
      const options = {
        uri: 'http://localhost:5000/api/csv',
        method: 'POST',
        json: {
          "vals": elem.vals,
          "output": elem.output
        }
      }

      request(options, (error, response, body) => {
        if (error) console.log(`Error posting to the database: ${error}`)
        else console.log(`Posted to the database; response code ${response.statusCode}`)
      })
    }
  )
}

module.exports = {
  parseFile: filename => {
    const fileArray = readFile(filename)
    sendData(fileArray)
  }
}