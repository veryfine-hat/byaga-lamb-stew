const Journal = require('@byaga/journal')
const eventFromLogData = (httpEvent = {}) => {
    const { headers = {} } = httpEvent;

    return {
        ...httpEvent,
        headers: {
            ...headers,
            'X-Forwarded-Referrer': Journal.get('referrer'),
            'X-Forwarded-User-Agent': Journal.get('userAgent'),
            'Accept-Language': Journal.get('language'),
            'X-Viewer-Country': Journal.get('country'),
            'X-Forwarded-For': Journal.get('forwardedIp'),
            'X-Trace-Id': Journal.get('traceId'),
            'X-Span-Id': Journal.get('spanId'),
            'X-Correlation-Id': Journal.get('correlationId')
        }
    };
};

module.exports = eventFromLogData;