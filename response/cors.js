const flattenHeaders = require('../lib/flatten-headers')
const Journal = require('@byaga/journal')
const deepMerge = require('../lib/deep-merge')
/**
 * Adds cors headers to the response
 * @param {IHttpLambdaEvent} event
 * @param {IHttpLambdaResponse|any} rsp
 * @param {ICorsOptions?} options - cors options
 * @returns {IHttpLambdaResponse}
 */
const cors = (rsp = {}, options = {}) => {
    const event = Journal.get('event')

    const origin = options.origin || ["*"]
    const methods = options.methods || cors.methods
    const allowHeaders = options.headers || cors.headers
    const exposeHeaders = options.headers || []

    const headers = flattenHeaders(event.headers)
    const allowedOrigins = Array.isArray(origin) ? origin : [origin]
    const allowAnyOrigin = allowedOrigins.includes("*")
    const referer = headers["x-forwarded-referrer"] || headers["referer"] || headers["referrer"]
    const refererDomain = referer?.substr(0, referer?.indexOf("/", 10))

    return deepMerge(rsp, {
        headers: {
            "Access-Control-Allow-Origin": (allowAnyOrigin || origin.includes(refererDomain)) ? refererDomain : origin[0],
            "Access-Control-Allow-Methods": methods.join(", "),
            "Access-Control-Allow-Headers": allowHeaders.join(", "),
            "Access-Control-Max-Age": options.maxAge || 86400,
            "Access-Control-Expose-Headers": Array.isArray(exposeHeaders) ? exposeHeaders.join(", ") : cors.exposeHeaders,
            "Access-Control-Allow-Credentials": options.allowCredentials || cors.allowCredentials,
            "Vary": allowAnyOrigin || allowedOrigins.length > 1 ? "Origin" : undefined
        }
    })
};

module.exports = cors;
cors.headers = ['X-Forwarded-Referrer', 'Referrer', 'Referer', 'Host', "X-Forwarded-User-Agent", "User-Agent", "Accept-Language", "Cache-Control",
    'X-Viewer-Country', 'X-Forwarded-For', 'X-Span-Id', 'X-Correlation-Id', 'Content-Type', 'Content-Length', 'Authorization']
cors.methods = ["GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
cors.exposeHeaders = ['Date']
cors.allowCredentials = true