// Author: Marios Igkiempor 10335752

const power = x => y => Math.pow(y, x)

const qSort = function (xs) {
  const swap = (xs, i, j) => {
    let temp = xs[i]
    xs[i] = xs[j]
    xs[j] = temp
  }
  const partition = (array, low, high) => {
    const pivot = array[high]
    let pivotIndex = low
    for (let j = low; j < high; j++) {
      if (array[j] <= pivot) {
        swap(array, j, pivotIndex)
        pivotIndex++
      }
    }

    swap(array, pivotIndex, high)
    return pivotIndex
  }

  const qSortIterative = array => {
    let stack = [] // auxiliary stack
    let start = 0
    let end = array.length - 1

    stack.push({ start, end })

    while (stack.length > 0) {
      const top = stack.pop()
      start = top.start
      end = top.end

      let pivot = partition(array, start, end)

      if (pivot - 1 > start) {
        stack.push({ start, end: pivot - 1 })
      }

      if (pivot + 1 < end) {
        stack.push({ start: pivot + 1, end })
      }
    }
  }

  if (xs.length < 2) return xs
  let output = [...xs]
  qSortIterative(output, 0, xs.length - 1)
  return output
}

const createUniqueArray = xs => [...new Set(xs)] // sets only allow unique values (ie categories)

const parseBool = x => x === '1' // assuming only numbers

module.exports = {
  // Curried power function, for use with Rambda functional-style functions
  power,

  // iterative quick sort implementation,
  // removes stack overflow errors possible with a recursive implementation
  qSort,
  createUniqueArray,
  parseBool
}
