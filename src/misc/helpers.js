global.pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

global.notNull = x => x !== null && x !== undefined