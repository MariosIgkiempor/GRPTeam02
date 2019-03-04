const R = require('ramda')
const { qSort } = require('../misc/helpers')
const distance = require('euclidean-distance')

// finds and returns the indicies of anomalous data
// anomalies are found on a per-feature basis (ie anomalies are found down a column)
// TODO: Different algorithm for anomaly detection, this relies too much on the interquartile range
// which may be too inaccurate (for example, set [1,2,3,90,2,4]), will have a high interquartile range
// and so the anomaly which is obvious to the human will not be detected by this method

/*
const findAnomalies = arr => {
  const median = (
    l,
    r // median of a sorted array is the element in the middle
  ) => Math.floor((r - l + 1 + 1) / 2 - 1)

  // anomaly is any value less than 1.5 times the IQR
  //                   or more than 1.5 times the IQR
  const isAnomaly = (q1, q3, iqr, x) => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr

  // finds the first and third quartiles and the interquartile range
  // and returns the values as an object
  const quartiles = xs => {
    let n = xs.length
    const medianIndex = median(0, n)
    const q1Arr = xs.slice(0, medianIndex) // first half of sorted values
    const q3Arr = xs.slice(medianIndex + 1) // last half of sorted values
    const q1 = q1Arr[median(0, q1Arr.length)] // first quartile
    const q3 = q3Arr[median(0, q3Arr.length)] // third quartile
    const iqr = q3 - q1 // interquartile range
    return { q1, q3, iqr }
  }

  const cols = R.transpose(arr)
  const colsSorted = R.map(qSort)(cols)
  const colsQuartlies = R.map(quartiles)(colsSorted)

  let anomalies = []
  let q1, q3, iqr
  arr.forEach((xs, row) => {
    // for each row of data
    xs.forEach((x, col) => {
      // for each column of a row
      ;({ q1, q3, iqr } = colsQuartlies[col]) // get the quartiles and inter-quartile range for that column
      if (isAnomaly(q1, q3, iqr, x)) {
        anomalies.push({ row, col })
      } // add it to the anomalies list
    })
  })

  return anomalies
}
*/

// Algorithm based on this research paper:
// https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0152173
/*
  Goldstein M, Uchida S (2016) A Comparative Evaluation of Unsupervised Anomaly Detection Algorithms for Multivariate Data.
  PLoS ONE 11(4): e0152173. https://doi.org/10.1371/journal.pone.0152173
*/

const data = [[1, 0], [0, 0], [5, 4], [100, 4], [20, 3], [50, 2], [2, 1]]
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
    distances[i] = qSort(distances[i]).filter(
      x => x !== 0 /* Get rid of any 0 values */
    )
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
  let averages = sums.map(x => x / K)

  // Return the index of top K records with highest average distances
  let sortedAverages = qSort(averages).reverse() // Sort average score in reverse order
  let potentialAnomalies = []
  for (let i = 0; i < K; ++i) {
    let index = averages.indexOf(sortedAverages[i]) // Find the index of record with the ith worst abnormality score
    potentialAnomalies.push(index)
  }
  return potentialAnomalies
}
console.log(findAnomalies(data))

module.exports = findAnomalies
