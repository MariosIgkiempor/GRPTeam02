module.exports = {
  notNull: x => x !== null && x !== undefined,

  flatten: a => [].concat(...a),

  isInteger: x => typeof x === 'number' && isFinite(x) && Math.floor(x) === x,

  isFloat: x => !!(x % 1),

  power: x => y => Math.pow(y, x),

  log: x => console.log(x),

  sum: xs => xs.reduce((a, x) => (a = x ? a + x : a), 0),

  mean: xs => this.sum(xs) / xs.length,

  // quick sort implementation
  qSort: function (xs) {
    const partition = (array, low, high) => {
      const pivot = array[high]
      let i = low - 1
      for (let j = low; j < high; j++) {
        if (array[j] <= pivot) {
          i++
          const temp = array[i]
          array[i] = array[j]
          array[j] = temp
        }
      }

      const temp = array[i + 1]
      array[i] = array[high]
      array[high] = temp

      return i + 1
    }

    const qSortIterative = (array, low, high) => {
      let stack = [] // auxiliary stack
      let top = -1 // top of the stack index

      stack[++top] = low
      stack[++top] = high

      while (top >= 0) {
        high = stack[top--]
        low = stack[top--]

        let p = partition(array, low, high)

        if (p - 1 > low) {
          stack[++top] = low
          stack[++top] = p - 1
        }

        if (p + 1 < high) {
          stack[++top] = p + 1
          stack[++top] = high
        }
      }
    }

    qSortIterative(xs, 0, xs.length - 1)
  }
}
