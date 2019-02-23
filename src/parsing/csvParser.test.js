const {
  isCategorical,
  createUniqueArray,
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

describe('csvParser.createUniqueArray', () => {
  test('Creates unique array when input is numerical array', () => {
    expect(createUniqueArray([1, 1, 1, 2, 3, 3, 2, 1, 2, 5, 5])).toEqual([
      1,
      2,
      3,
      5
    ])
    expect(createUniqueArray([1.1, 1.2, 1.2, 1.2, 1.2, 1.1, 1.3, 1.3])).toEqual(
      [1.1, 1.2, 1.3]
    )
    expect(createUniqueArray([1.1, 1, 1.2, 1.2, 1.2, 1.1, 3, 1.3])).toEqual([
      1.1,
      1,
      1.2,
      3,
      1.3
    ])
  })
  test('Creates unique array when input is boolean array', () => {
    expect(createUniqueArray([true, true, true, false, false, true])).toEqual([
      true,
      false
    ])
  })
  test('Creates unique array when input is string array', () => {
    expect(createUniqueArray(['a', 'b', 'c', 'c', 'a', 'a', 'c'])).toEqual([
      'a',
      'b',
      'c'
    ])
  })
  test('Singleton array input return the same array as output', () => {
    expect(createUniqueArray([1])).toEqual([1])
    expect(createUniqueArray([true])).toEqual([true])
    expect(createUniqueArray(['hello'])).toEqual(['hello'])
  })
  test('Empty array input returns empty array as output', () => {
    expect(createUniqueArray([])).toEqual([])
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
