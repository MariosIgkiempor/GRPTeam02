// Author: Marios Igkiempor 10335752

const R = require('ramda')
const { power } = require('../misc/helpers')

// Complexity assumed to be the average of the variance in each column
const findComplexity = arr => {
  let totalVariance = 0
  // variance s = (1/N-1)(sum((X-Mx)^2))
  const columns = R.transpose(arr)
  const means = R.map(R.mean)(columns)
  columns.forEach((xs, i) => {
    const diff = R.map(x => x - means[i])(xs) // X - Mx
    const diffSquared = R.map(power(2))(diff) // (X - Mx)^2
    const sumXs = R.sum(diffSquared) // sum((X - Mx)^2)
    const s = sumXs / (xs.length - 1) // bias-corrected variance
    totalVariance += s
  })

  const averageVariance = totalVariance / columns.length
  return averageVariance
}

module.exports = findComplexity
