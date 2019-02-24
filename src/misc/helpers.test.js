const { power, qSort, createUniqueArray } = require('./helpers')

describe('helpers.power', () => {
  test('correctly exponentiates positive integers', () => {
    expect(power(2)(3)).toBe(9)
    expect(power(3)(9)).toBe(729)
  })

  test('correctly exponentiates negative integers', () => {
    expect(power(2)(-4)).toBe(16)
    expect(power(3)(-5)).toBe(-125)
  })

  test('correctly deals with negative powers', () => {
    expect(power(-2)(10)).toBe(0.01)
    expect(power(-3)(50)).toBe(0.000008)
  })

  test('correctly deals with floating point powers', () => {
    expect(power(0.5)(64)).toBe(8)
    expect(power(0.3)(10)).toBe(1.9952623149688795)
  })

  test('correctly exponentiates floating point numbers', () => {
    expect(power(2)(1.5)).toBe(2.25)
    expect(power(3)(10.5)).toBe(1157.625)
  })

  test('correctly deals with negative floating point powers', () => {
    expect(power(-0.5)(64)).toBe(0.125)
    expect(power(-0.5)(64)).toBe(0.125)
  })

  test('correctly exponentiates negative floating point numbers', () => {
    expect(power(2)(-1.5)).toBe(2.25)
    expect(power(3)(-10.5)).toBe(-1157.625)
  })
})

describe('helpers.qSort', () => {
  test('empty array returns empty array', () => {
    expect(qSort([])).toEqual([])
  })

  test('singleton arrays return the same singleton array', () => {
    expect(qSort([1])).toEqual([1])
    expect(qSort([0])).toEqual([0])
    expect(qSort([Math.PI])).toEqual([Math.PI])
  })

  test('integer arrays sort correctly', () => {
    expect(qSort([1, 5, 100, 47])).toEqual([1, 5, 47, 100])
    expect(qSort([20, 4, 10, 9, 200, 20])).toEqual([4, 9, 10, 20, 20, 200])
  })

  test('float arrays sort correctly', () => {
    expect(qSort([5.5, 5.5, 100.5, 47.5])).toEqual([5.5, 5.5, 47.5, 100.5])
    expect(qSort([20.2, 4.2, 10.2, 9.2, 200.2, 20.2])).toEqual([
      4.2,
      9.2,
      10.2,
      20.2,
      20.2,
      200.2
    ])
  })
})

describe('helpers.createUniqueArray', () => {
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
