const deepMerge = require('./deep-merge')
const Journal = require('@byaga/journal');

/**
 *
 * @param {{[string]: string}} request?
 * @returns {Promise}
 */
const applyUser = async (request = {}) => {
  const authToken = (Journal.get('headers') || {}).authorization
  const userData = Journal.get('user-context-data')

  return deepMerge(request, userData, {
    headers: { Authorization: authToken }
  })
};

module.exports = applyUser;
