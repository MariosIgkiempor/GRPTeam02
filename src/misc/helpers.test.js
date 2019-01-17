const helpers = require('./helpers')

describe('isNull', () => {
  test('returns true when passed null', () => {
    const answer = helpers.isNull(null)
    expect(answer).toBe(true)
  })

  test('returns true when passed undefined', () => {
    const answer = helpers.isNull(undefined)
    expect(answer).toBe(true)
  })

  test('returns false when passed a positive number', () => {
    const answer = helpers.isNull(123)
    expect(answer).toBe(false)
  })

  test('returns false when passed a negative number', () => {
    const answer = helpers.isNull(-123)
    expect(answer).toBe(false)
  })

  test('returns false when passed a string', () => {
    const answer = helpers.isNull('aaa')
    expect(answer).toBe(false)
  })

  test('returns false when passed an array', () => {
    const answer = helpers.isNull([1, 2, 3])
    expect(answer).toBe(false)
  })

  test('returns false when passed an object', () => {
    const answer = helpers.isNull({ a: 1, b: 'hello' })
    expect(answer).toBe(false)
  })

  test('returns false when passed a boolean true', () => {
    const answer = helpers.isNull(true)
    expect(answer).toBe(false)
  })

  test('returns false when passed a boolean false', () => {
    const answer = helpers.isNull(false)
    expect(answer).toBe(false)
  })
})

describe('flatten', () => {
  test('empty array returns empty array', () => {
    const answer = helpers.flatten([])
    expect(answer).toEqual([])
  })
  test('1d singleton array returns the same array', () => {
    const answer = helpers.flatten([1])
    expect(answer).toEqual([1])
  })
  test('1d array returns the same array ', () => {
    const answer = helpers.flatten([1, 2, 3])
    expect(answer).toEqual([1, 2, 3])
  })
  test('2d singleton array returns the same array in 1d', () => {
    const answer = helpers.flatten([[1], [2], [3]])
    expect(answer).toEqual([1, 2, 3])
  })
  test('2d array returns the same array flattened in 1d', () => {
    const answer = helpers.flatten([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    expect(answer).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})

describe('isInteger', () => {
  test('returns true when passed 0', () => {
    const answer = helpers.isInteger(0)
    expect(answer).toBe(true)
  })
  test('returns true when passed a non-zero integer', () => {
    const answer = helpers.isInteger(999)
    expect(answer).toBe(true)
  })
  test('returns true when passed a negative integer', () => {
    const answer = helpers.isInteger(-5)
    expect(answer).toBe(true)
  })
  test('returns false when passed a floating point number', () => {
    const answer = helpers.isInteger(1.5)
    expect(answer).toBe(false)
  })
  test('returns false when passed a negative floating point number', () => {
    const answer = helpers.isInteger(-5.6)
    expect(answer).toBe(false)
  })
  test('returns false when passed Math.PI', () => {
    const answer = helpers.isInteger(Math.PI)
    expect(answer).toBe(false)
  })
})
