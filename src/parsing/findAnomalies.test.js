const findAnomalies = require('./findAnomalies')

describe('csvParser.findAnomalies', () => {
  const anomalousData = [
    [1, 4, 3, 2, 2, 2, 100],
    [1, 2, 3, 1, 2, 99, 1],
    [1, 2, 3, 4, 2, 2, 100],
    [1, 3, 3, 2, 2, 2, 100],
    [1, 60, 3, 2, 2, 2, 100]
  ]

  const regularData = [
    [1, 2, 3, 2, 2],
    [1, 2, 3, 1, 2],
    [1, 4, 4, 1, 2],
    [1, 1, 5, 1, 2]
  ]
  test('Correctly finds indicies of anomalies', () => {
    const indicies = findAnomalies(anomalousData)
    expect(indicies).toStrictEqual([
      { row: 4, col: 1 },
      { row: 1, col: 5 },
      { row: 1, col: 6 }
    ])
  })
})
