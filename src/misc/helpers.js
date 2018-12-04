global.pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

global.notNull = x => x !== null && x !== undefined

global.flatten = a => [].concat(...a)

global.isInteger = x => typeof x === "number" && isFinite(x) && Math.floor(x) === x

global.isFloat = x => !!(x % 1)

global.power = x => y => Math.pow(y, x)

global.log = x => console.log(x)

global.sum = xs => xs.reduce((a, x) => a += x)

global.mean = xs => global.sum(xs) / xs.length

global.transpose = xs => xs[0].map((x,i) => xs.map(x => x[i]))

// quick sort implementation
global.qSort = xs => {
  if (xs.length < 2) return xs
  const pivot  = xs[Math.floor(xs.length / 2)]
  const lower  = []
  const equal  = []
  const higher = []
  for (let i = 0, length = xs.length; i < length; i++) {
    if      (xs[i] < pivot)   lower.push(xs[i])
    else if (xs[i] === pivot) equal.push(xs[i])
    else                      higher.push(xs[i])
  }
  return [ ...qSort(lower), ...equal, ...qSort(higher) ]
}