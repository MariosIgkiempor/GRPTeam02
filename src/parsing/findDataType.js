// Author: Marios Igkiempor 10335752

const R = require('ramda')

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

module.exports = findValsDataType
