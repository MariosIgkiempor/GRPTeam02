const R = require('ramda')

const findRelations = function (data, threshold) {
  const columns = R.transpose(data)

  // Create an array of every pair of columns in the array
  const pairs = columns.reduce(
    (acc, val, i1) => [
      ...acc,
      ...new Array(columns.length - 1 - i1)
        .fill(0)
        .map((v, i2) => [columns[i1], columns[i1 + 1 + i2]])
    ],
    []
  )

  // Covariance between each pair of columns as a measure of relation
  const covariances = pairs.map(pair => {
    const meanX = R.mean(pair[0]) // Mx
    const meanY = R.mean(pair[1]) // My
    const xs = R.map(x => x - meanX)(pair[0]) // X - Mx
    const ys = R.map(y => y - meanY)(pair[1]) // Y - My
    const xsys = xs.map((x, i) => x * ys[i]) // (X - Mx)(Y - My)
    const sumXsys = R.sum(xsys)
    const covariance = sumXsys / (pairs[0].length - 1)
    return covariance
  })

  return covariances
}

module.exports = findRelations
