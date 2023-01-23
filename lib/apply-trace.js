const Context = require('../context')
const eventFromLogData = (httpEvent = {}) => {
    const { headers = {} } = httpEvent;

    return {
        ...httpEvent,
        headers: {
            ...headers,
            'X-Forwarded-Referrer': Context.get('referrer'),
            'X-Forwarded-User-Agent': Context.get('userAgent'),
            'Accept-Language': Context.get('language'),
            'X-Viewer-Country': Context.get('country'),
            'X-Forwarded-For': Context.get('forwardedIp'),
            'X-Trace-Id': Context.get('traceId'),
            'X-Span-Id': Context.get('spanId'),
            'X-Correlation-Id': Context.get('correlationId')
        }
    };
};

module.exports = eventFromLogData;