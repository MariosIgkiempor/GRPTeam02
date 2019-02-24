const isCategorical = require('./isCategorical')

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
