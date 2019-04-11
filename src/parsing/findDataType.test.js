// Author: Marios Igkiempor 10335752

const findDataType = require('./findDataType')

const emptyData = [[], [], [], [], [], []]
const numericalData = [
  [1, 1, 1.9, 2.111, 3],
  [2, 432, 1244, 88, 13],
  [128, 123, 1.234231, 213.111, 54325],
  [154325, 1123, 1.5423, 2121, 3123847],
  [1293478, 122, 0, 2.132415, 23112]
]

const numericalDataWrappedInString = [
  ['1', '1', '1.9', '2.111', '3'],
  ['2', '432', '1244', '88', '13'],
  ['128', '123', '1.234231', '213.111', '54325'],
  ['154325', '1123', '1.5423', '2121', '3123847'],
  ['1293478', '122', '0', '2.132415', '23112']
]

const booleanData10 = [
  [1, 0, 0, 1, 1],
  [1, 1, 1, 0, 1],
  [1, 0, 1, 0, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1]
]

const booleanData10WrappedInString = [
  ['1', '0', '0', '1', '1'],
  ['1', '1', '1', '0', '1'],
  ['1', '0', '1', '0', '1'],
  ['0', '0', '0', '1', '1'],
  ['0', '0', '0', '0', '1']
]

const booleanData1minus1 = [
  [1, -1, -1, 1, 1],
  [1, 1, 1, -1, 1],
  [1, -1, 1, -1, 1],
  [-1, -1, -1, 1, 1],
  [-1, -1, -1, -1, 1]
]

const stringData = [
  ['aaa', 'bbb', 'ccc', 'aaa', 'ccc'],
  ['aaa', 'bbb', 'ccc', 'aaa', 'ccc'],
  ['aaa', 'bbb', 'ccc', 'aaa', 'ccc'],
  ['aaa', 'bbb', 'ccc', 'aaa', 'ccc'],
  ['aaa', 'bbb', 'ccc', 'aaa', 'ccc']
]

const mostlyNumericalData = [
  ['1', '1', '1.9', '2.111', '3'],
  ['2', '432', '1244', '88', '13'],
  ['128', '123', '1.234231', '213.111', '54325'],
  ['154325', '1123', '1.5423', '2121', '3123847'],
  ['1293478', '122', '0', '2.132415', 'string!!']
]

describe('csvParser.findDataType', () => {
  test('Outputs "empty" for empty dataset', () => {
    expect(findDataType(emptyData)).toBe('empty')
  })
  test('Outputs "number" for numerical dataset', () => {
    expect(findDataType(numericalData)).toBe('number')
  })

  test('Outputs "number" for numerical dataset that comes in as string data', () => {
    expect(findDataType(numericalDataWrappedInString)).toBe('number')
  })

  test('Outputs "boolean" for boolean dataset that is all 1s or 0s', () => {
    expect(findDataType(booleanData10)).toBe('boolean')
  })

  test('Outputs "boolean" for boolean dataset that is all -1s or 1s', () => {
    expect(findDataType(booleanData1minus1)).toBe('boolean')
  })

  test('Outputs "boolean" for boolean dataset that comes in as string data', () => {
    expect(findDataType(booleanData10WrappedInString)).toBe('boolean')
  })

  test('Outputs "string" for string dataset', () => {
    expect(findDataType(stringData)).toBe('string')
  })

  test('Outputs "string" for dataset that has mostly numbers but only a single string value', () => {
    expect(findDataType(mostlyNumericalData)).toBe('string')
  })
})
