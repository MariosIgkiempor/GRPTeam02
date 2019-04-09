// Author: Marios Igkiempor 10335752

const R = require('ramda')
const { power } = require('../misc/helpers')

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
    const MxsSqared = R.mean(R.map(power(2))(xs)) // mean((X - Mx) ^ 2)
    const MysSqared = R.mean(R.map(power(2))(ys)) // mean((Y - My) ^ 2)
    const den1 = Math.pow(MxsSqared, 0.5) // sqrt(sum(X - Mx)^2)
    const den2 = Math.pow(MysSqared, 0.5) // sqrt(sum(Y - My)^2)
    const r = num / (den1 * den2) // correlation coefficient
    totalCorrelationCoefficient += r
  })

  // high average correlation between columns means high structure in the dataset
  const structure = totalCorrelationCoefficient / pairs.length
  return isNaN(structure) ? 0 : structure
}

console.log(findStructure([[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]]))

module.exports = findStructure
