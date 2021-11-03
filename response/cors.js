/**
 * Adds cors headers to the response
 * @param {IHttpLambdaEvent} event
 * @param {IHttpLambdaResponse|any} rsp
 * @param {CorsOptions?} options - cors options
 * @returns {IHttpLambdaResponse}
 */
const cors = (event, rsp = {}, options = {}) => {
    const origin = options.origin || ["*"]
    const methods = options.methods || cors.methods
    const allowHeaders = options.headers || cors.headers
    const exposeHeaders = options.headers || []

    const allowedOrigins = Array.isArray(origin) ? origin : [origin]
    const allowAnyOrigin = allowedOrigins.includes("*")
    const referer = event?.headers["X-Forwarded-Referrer"] || event?.headers?.Referer || event?.headers?.Referrer
    const refererDomain = referer?.substr(0, referer?.indexOf("/", 8))

    return {
        ...rsp,
        headers: {
            ...rsp?.headers,
            "Access-Control-Allow-Origin": (allowAnyOrigin || origin.includes(refererDomain)) ? refererDomain : origin[0],
            "Access-Control-Allow-Methods": methods.join(", "),
            "Access-Control-Allow-Headers": allowHeaders.join(", "),
            "Access-Control-Max-Age": options.maxAge || 86400,
            "Access-Control-Expose-Headers": exposeHeaders.length ? exposeHeaders.join(", ") : undefined,
            "Vary": allowAnyOrigin || allowedOrigins.length > 1 ? "Origin" : undefined
        }
    }
};

module.exports = cors;
cors.headers = ['X-Forwarded-Referrer', 'Referrer', 'Referer', 'Host', "X-Forwarded-User-Agent", "User-Agent", "Accept-Language", "Cache-Control",
    'X-Viewer-Country', 'X-Forwarded-For', 'X-Span-Id', 'X-Correlation-Id', 'Content-Type', 'Content-Length', 'Authorization']
cors.methods = ["GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]

/**
 * @typedef CorsOptions
 * @property {string?} origin
 * @property {boolean?} allowCredentials
 * @property {string[]?} methods
 * @property {string[]?} headers
 * @property {number?} maxAge
 */