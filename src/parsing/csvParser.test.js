const { findMatchingIndicies, findAnomalies } = require('./csvParser')

describe('csvParser.findMatchingIndicies', () => {
  // Predicate function to be used with the tests for findMatchingIndicies
  const predicate = x => x === 1
  // Curried findMatchingIndicies function to use for the tests
  const curriedTestFn = findMatchingIndicies(predicate)

  test('Returns a list of correct indicies when the predicate matches', () => {
    expect(curriedTestFn([1, 2, 1, 1, 3])).toEqual([0, 2, 3])
    expect(curriedTestFn([3, 1, 1, 1, 2])).toEqual([1, 2, 3])
    expect(curriedTestFn([3, 0, 5, 0, 1])).toEqual([4])
    expect(curriedTestFn([1])).toEqual([0])
  })
  test('Returns an empty list when the predicate does not match any elements', () => {
    expect(curriedTestFn([2, 3, 4, 5, 6])).toEqual([])
    expect(curriedTestFn(['a', 'b', 'c'])).toEqual([])
  })
  test('Returns an empty list when the input is empty', () => {
    expect(curriedTestFn([])).toEqual([])
  })
})

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
