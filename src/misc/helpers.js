global.pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

global.notNull = x => x !== null && x !== undefined

global.flatten = a => [].concat(...a)

global.isInteger = x => typeof x === "number" && isFinite(x) && Math.floor(x) === x

global.isFloat = x => !!(x % 1)

global.power = x => y => Math.pow(y, x)

global.log = x => console.log(x)