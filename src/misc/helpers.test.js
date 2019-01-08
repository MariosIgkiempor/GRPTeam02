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
})
