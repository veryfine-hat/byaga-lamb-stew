const eventFromLogData = (eventTrace, httpEvent = {}) => {
    const { headers = {} } = httpEvent;

    return {
        ...httpEvent,
        headers: {
            ...headers,
            'X-Forwarded-Referrer': eventTrace.referrer,
            'X-Forwarded-User-Agent': eventTrace.userAgent,
            'Accept-Language': eventTrace.language,
            'X-Viewer-Country': eventTrace.country,
            'X-Forwarded-For': eventTrace.forwardedIp,
            'X-Trace-Id': eventTrace.traceId,
            'X-Span-Id': eventTrace.spanId,
            'X-Correlation-Id': eventTrace.correlationId
        }
    };
};

module.exports = eventFromLogData;