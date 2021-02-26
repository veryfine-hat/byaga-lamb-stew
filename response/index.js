/***
 * Applies the specified status Code the the response object
 * @param {Number} statusCode
 * @param {Response} rsp
 * @returns {Response}
 */
exports.statusCode = (statusCode, rsp = {}) => ({...rsp, statusCode });

/***
 * Returns a HTTP OK response
 * @param rsp? {Response}
 * @returns {Response}
 */
exports.ok = rsp => exports.statusCode(200, rsp);

/***
 * Returns a HTTP Created response
 * @param rsp? {Response}
 * @returns {Response}
 */
exports.created = rsp => exports.statusCode(201, rsp);

/***
 * Returns a HTTP OK No Content response
 * @param rsp? {Response}
 * @returns {Response}
 */
exports.okNoContent = rsp => exports.statusCode(204, rsp);

/***
 * Returns a HTTP Bad Request response
 * @param {Response} rsp?
 * @returns {Response}
 */
exports.badRequest = rsp => exports.statusCode(400, rsp);
exports.unauthorized = rsp => exports.statusCode(401, rsp);
exports.forbidden = rsp => exports.statusCode(403, rsp);

/***
 * Returns a HTTP Not Found response
 * @param rsp? {Response}
 * @returns {Response}
 */
exports.notFound = rsp => exports.statusCode(404, rsp);

/***
 * Returns a HTTP Server Error response
 * @param rsp? {Response}
 * @returns {Response}
 */
exports.serverError = rsp => exports.statusCode(500, rsp);

/**
 * @typedef Response
 * @property {Number} statusCode
 * @property {Object} [headers}
 */