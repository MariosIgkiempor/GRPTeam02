// Author: Marios Igkiempor 10335752

const { findMatchingIndicies } = require('./csvParser')

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
