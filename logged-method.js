const Context = require('./context')
const loggedMethod = (name, fn) => {
  return async (...args) => {
    const done = Context.startTimer(name)
    try {
      return await fn(...args);
    } catch (error) {
      Context.exception(error);
      return { error };
    } finally {
      done()
    }
  }
}

module.exports = loggedMethod