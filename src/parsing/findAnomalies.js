// Author: Marios Igkiempor 10335752

const R = require('ramda')
const { qSort } = require('../misc/helpers')
const distance = require('euclidean-distance')

// Algorithm based on this research paper:
// https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0152173
/*
  Goldstein M, Uchida S (2016) A Comparative Evaluation of Unsupervised Anomaly Detection Algorithms for Multivariate Data.
  PLoS ONE 11(4): e0152173. https://doi.org/10.1371/journal.pone.0152173
*/

const findAnomalies = function (arr) {
  // Curry the distance function for easier use with map
  let dist = R.curry(distance)
  // Find the distance from each row in the data to each other row
  let distances = []
  for (let i = 0; i < arr.length; ++i) {
    let row = arr[i]
    let rowDistances = R.map(dist(row))(arr)
    distances.push(rowDistances)
  }

  // Sort the distances for each row
  for (let i = 0; i < distances.length; ++i) {
    distances[i] = R.filter(x => x !== 0, qSort(distances[i])) // Filter out 0 values (distance from a record to itself)
  }

  // Compute an abnormality score
  // Based on the average distance to the top k nearest neighbours
  // TODO: Experiment with different scores of k. Recommended 10 <= k <= 50
  // Because size of the dataset is not known, k should be a percentage of the total number of rows in the dataset
  const K = distances.length / 4 < 1 ? 1 : distances.length / 4 // Give K a lower bound of 1

  // Take the average of the top K nearest neighbours
  let sums = Array(distances.length).fill(0)
  for (let i = 0; i < distances.length; ++i) {
    for (let j = 0; j < K; ++j) {
      sums[i] += distances[i][j]
    }
  }

  // Find average distance to K nearest neigbours
  let averages = R.map(x => x / K, sums)

  // Return the index of top K records with highest average distances
  // TODO: Return the records with the highest abnormality score using IQR method
  let sortedAverages = R.reverse(qSort(averages)) // Sort average score in reverse order
  let potentialAnomalies = []
  for (let i = 0; i < K; ++i) {
    let index = R.indexOf(sortedAverages[i], averages) // Find the index of record with the ith worst abnormality score
    potentialAnomalies.push(index)
  }
  return qSort(potentialAnomalies) // Return anomalous rows in order of index
}
// console.log(findAnomalies(data))

module.exports = findAnomalies
