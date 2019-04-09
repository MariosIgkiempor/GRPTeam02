// Author: Marios Igkiempor 10335752

const findAnomalies = require('./findAnomalies')

describe('csvParser.findAnomalies', () => {
  const anomalousData = [
    [5, 3, 2],
    [4, 8, 9],
    [100, 30, 2],
    [10, 7, 3],
    [200, 3, 0]
  ]

  const regularData = [
    [1, 2, 3, 2, 2],
    [1, 2, 3, 1, 2],
    [1, 4, 4, 1, 2],
    [1, 1, 5, 1, 2]
  ]
  test('Correctly finds indicies of anomalous records', () => {
    const indicies = findAnomalies(anomalousData)
    expect(indicies).toEqual([2, 4])
  })
})
