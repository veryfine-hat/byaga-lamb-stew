const loggedMethod = (name, fn) => {
  return async (...args) => {
    const logger = args[args.length - 1]
    const done = logger.startTimer(name)
    try {
      return await fn(...args);
    } catch (error) {
      logger.exception(error);
      return { error };
    } finally {
      done()
    }
  }
}

module.exports = loggedMethod