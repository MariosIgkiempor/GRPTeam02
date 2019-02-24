const {
  isCategorical,
  findMatchingIndicies,
  findAnomalies
} = require('./csvParser')

describe('csvParser.isCategorical', () => {
  test('Outputs true for a given numerical categorical dataset and threshold', () => {
    const labels = [0.1, 0.3, 0.1, 0.1, 0.8, 0.3, 0.3, 0.1, 0.1, 0.8]
    expect(isCategorical(labels, 0.3)).toBe(true)
    expect(isCategorical(labels, 0.4)).toBe(true)
    expect(isCategorical(labels, 1)).toBe(true)
  })
  test('Outputs true for a given boolean categorical dataset and threshold', () => {
    const labels = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1]
    expect(isCategorical(labels, 0.3)).toBe(true)
    expect(isCategorical(labels, 0.4)).toBe(true)
    expect(isCategorical(labels, 1)).toBe(true)
  })
  test('Outputs true for a given string categorical dataset and threshold', () => {
    const labels = ['a', 'b', 'b', 'b', 'a', 'a', 'b', 'a', 'c', 'c']
    expect(isCategorical(labels, 0.3)).toBe(true)
    expect(isCategorical(labels, 0.4)).toBe(true)
  })
  test('Outputs false for a continuous dataset, given a realistic threshold', () => {
    const labels = [0.11, 0.2, 0.3, 0.4, 0.5, 0.6, 0.323, 0.15, 0.4]
    expect(isCategorical(labels, 0.1)).toBe(false)
    expect(isCategorical(labels, 0.2)).toBe(false)
    expect(isCategorical(labels, 0.4)).toBe(false)
    expect(isCategorical(labels, 0.6)).toBe(false)
    expect(isCategorical(labels, 0.8)).toBe(false)
  })
  test('Threshold is used correctly', () => {
    const labels = ['a', 'b', 'b', 'b', 'a', 'a', 'b', 'a', 'c', 'c']
    expect(isCategorical(labels, 0.1)).toBe(false)
    expect(isCategorical(labels, 0.2)).toBe(false)
    expect(isCategorical(labels, 0.29)).toBe(false)
    expect(isCategorical(labels, 0.3)).toBe(true)
    expect(isCategorical(labels, 0.4)).toBe(true)
    expect(isCategorical(labels, 0.5)).toBe(true)
  })
})

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
