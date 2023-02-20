const { v4: uuid } = require('uuid');
const flattenHeaders = require("./flatten-headers");
const Journal = require("@byaga/journal")

const isTrue = value => value === 'true'

const eventData = () => {
    const event = Journal.get('event');
    const context = Journal.get('context');

    const { requestContext = {} } = event;
    const { identity = {} } = requestContext;
    const headers = flattenHeaders(event.headers);
    Journal.set('headers', headers, true)

    const details = {
        path: event.path,
        httpMethod: event.httpMethod ? event.httpMethod.toLowerCase() : undefined,
        referrer: headers['x-forwarded-referrer'] || headers.referrer || headers.referer,
        host: headers.host,
        userAgent: headers["x-forwarded-user-agent"] || headers["user-agent"],
        language: headers["accept-language"],
        cacheControl: headers["cache-control"],
        isDesktop: isTrue(headers["cloudfront-is-desktop-viewer"]),
        isMobile: isTrue(headers["cloudfront-is-mobile-viewer"]),
        isSmartTv: isTrue(headers["cloudfront-is-smarttv-viewer"]),
        isTablet: isTrue(headers["cloudfront-is-tablet-viewer"]),
        deviceType: ['desktop', 'mobile', 'smarttv', 'tablet'].find(type => isTrue(headers[`cloudfront-is-${type}-viewer`])) || 'unknown',
        country: headers['x-viewer-country'] || headers["cloudfront-viewer-country"],
        ipAddress: identity.sourceIp,
        forwardedIp: headers['x-forwarded-for'] || identity.sourceIp,
        stage: requestContext.stage,
        requestId: context.awsRequestId || requestContext.requestId,
        traceId: headers['x-trace-id'] || uuid(),
        spanId: uuid(),
        parentId: headers['x-span-id'],
        correlationId: headers['x-correlation-id'] || context.awsRequestId || requestContext.requestId,
        requestTime: requestContext.requestTimeEpoch ? new Date(requestContext.requestTimeEpoch).toISOString() : undefined
    };
    Journal.bulkSet(details, true);
    return details;
};

module.exports = eventData;