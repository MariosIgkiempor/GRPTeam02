// Author: Marios Igkiempor 10335752

const R = require('ramda')
const { createUniqueArray } = require('../misc/helpers')
const findDataType = require('./findDataType')

const isCategorical = (labels, threshold) => {
  if (findDataType(labels) === 'boolean') return true // booleans are categorical by default

  const uniqueCount = R.length(createUniqueArray(labels))
  let categorical = !(uniqueCount > labels.length * threshold) // if all lavels are numbers and less than a constant ratio of the labels are unique, assume categories

  return categorical
}

module.exports = isCategorical
