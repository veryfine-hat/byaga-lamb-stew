const { identifyUser } = require("./identify-user")
const { forbidden } = require("./response")

const requireAuth = (fn) =>
  (...argd) => {
    const user = identifyUser();
    const userId = user?.data?.sub;
    if (!userId) return forbidden()

    return fn(...args)
  }

module.exports = requireAuth