// Author: Marios Igkiempor 10335752

const R = require('ramda')
const { power } = require('../misc/helpers')

const findComplexity = arr => {
  // TODO: Shannon Entropy!! for complexity
  // TODO: missing values
  // TODO: anomalies
  // or ask the user
  // how chaotic single values are

  let totalVariance = 0
  // s = (1/N-1)(sum((X-Mx)^2))
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
