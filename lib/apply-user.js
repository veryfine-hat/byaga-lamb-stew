const deepMerge = require('./deep-merge')
const Journal = require('@byaga/journal');

/**
 *
 * @param {{[string]: string}} request?
 * @returns {{[string]: string, headers: { [string]: string, Authorization: string }}}
 */
const applyUser = (request = {}) =>
  deepMerge(request, Journal.get('event-user-data'));

module.exports = applyUser;
