// Author: Marios Igkiempor 10335752

const R = require('ramda')
const { createUniqueArray } = require('../misc/helpers')
const findDataType = require('./findDataType')

const isCategorical = (labels, threshold) => {
  // booleans are categorical by default
  if (findDataType(labels) === 'boolean') return true

  const uniqueCount = R.length(createUniqueArray(labels))
  // if all labels are numbers and less than a given ratio of the labels are unique, assume the dataset is categorical
  let categorical = uniqueCount < labels.length * threshold

  return categorical
}

module.exports = isCategorical
