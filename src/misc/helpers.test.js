const helpers = require('./helpers')

describe('helpers.power', () => {
  test('correctly exponentiates positive integers', () => {
    expect(helpers.power(2)(3)).toBe(9)
    expect(helpers.power(3)(9)).toBe(729)
  })

  test('correctly exponentiates negative integers', () => {
    expect(helpers.power(2)(-4)).toBe(16)
    expect(helpers.power(3)(-5)).toBe(-125)
  })

  test('correctly deals with negative powers', () => {
    expect(helpers.power(-2)(10)).toBe(0.01)
    expect(helpers.power(-3)(50)).toBe(0.000008)
  })

  test('correctly deals with floating point powers', () => {
    expect(helpers.power(0.5)(64)).toBe(8)
    expect(helpers.power(0.3)(10)).toBe(1.9952623149688795)
  })

  test('correctly exponentiates floating point numbers', () => {
    expect(helpers.power(2)(1.5)).toBe(2.25)
    expect(helpers.power(3)(10.5)).toBe(1157.625)
  })

  test('correctly deals with negative floating point powers', () => {
    expect(helpers.power(-0.5)(64)).toBe(0.125)
    expect(helpers.power(-0.5)(64)).toBe(0.125)
  })

  test('correctly exponentiates negative floating point numbers', () => {
    expect(helpers.power(2)(-1.5)).toBe(2.25)
    expect(helpers.power(3)(-10.5)).toBe(-1157.625)
  })
})

describe('helpers.qSort', () => {
  test('empty array returns empty array', () => {
    expect(helpers.qSort([])).toEqual([])
  })

  test('singleton arrays return the same singleton array', () => {
    expect(helpers.qSort([1])).toEqual([1])
    expect(helpers.qSort([0])).toEqual([0])
    expect(helpers.qSort([Math.PI])).toEqual([Math.PI])
  })

  test('integer arrays sort correctly', () => {
    expect(helpers.qSort([1, 5, 100, 47])).toEqual([1, 5, 47, 100])
    expect(helpers.qSort([20, 4, 10, 9, 200, 20])).toEqual([
      4,
      9,
      10,
      20,
      20,
      200
    ])
  })

  test('float arrays sort correctly', () => {
    expect(helpers.qSort([5.5, 5.5, 100.5, 47.5])).toEqual([
      5.5,
      5.5,
      47.5,
      100.5
    ])
    expect(helpers.qSort([20.2, 4.2, 10.2, 9.2, 200.2, 20.2])).toEqual([
      4.2,
      9.2,
      10.2,
      20.2,
      20.2,
      200.2
    ])
  })
})
