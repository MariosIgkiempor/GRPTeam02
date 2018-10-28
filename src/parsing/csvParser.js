module.exports = {
  readFile: (filename) => {
    const fs = require('fs')
  
    const fileData = fs.readFileSync(`${__dirname}/datasets/${filename}`, 'utf8')

    const dataArray = fileData.trim().split('\r\n')
    dataArray.shift()

    const obj = {}
    dataArray.forEach((elem, index) => {
      obj[`${index}`] = {}
      let valuesArray = elem.split(',')
      obj[`${index}`]['output'] = JSON.parse(valuesArray.pop().toLowerCase())
      valuesArray = valuesArray.map(value => parseInt(value))
      obj[`${index}`]['vals'] = valuesArray
    })
    console.log(obj)
  }
}