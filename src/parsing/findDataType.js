// Author: Marios Igkiempor 10335752

const R = require('ramda')

const findValsDataType = arr => {
  // Filter out all values that are null
  const vals = R.filter(x => x !== null)(R.flatten(arr))
  // If after filtering out null values the array is empty, the dataset must be empty
  if (vals.length === 0) return 'empty'

  // Attempt to parse values into numbers
  const parsedNumbers = R.map(parseFloat)(vals)
  const isNumber = R.all(x => !isNaN(x))(parsedNumbers)

  // values are boolean if all values are all (1 or 0) or (1 or -1)
  const isBoolean =
    isNumber &&
    (R.all(R.either(R.equals(1), R.equals(0)))(parsedNumbers) ||
      R.all(R.either(R.equals(1), R.equals(-1)))(parsedNumbers))

  if (isBoolean) return 'boolean'
  else if (isNumber) return 'number'
  else return 'string' // if not boolean, dataType is assumed to be a String
}

module.exports = findValsDataType
