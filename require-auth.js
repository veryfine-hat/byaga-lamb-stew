const { identifyUser } = require("./identify-user")
const { forbidden } = require("./response")

const requireAuth = (fn) => {
  return (event, context) => {
    const user = identifyUser(event, context);
    const userId = user?.data?.sub;
    if (!userId) return forbidden()

    return fn(event, {
      ...context,
      user: user.data
    })
  }
}

module.exports = requireAuth