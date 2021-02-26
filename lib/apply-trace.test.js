const applyTrace = require("./apply-trace")

const eventDetails = {
    referrer: 'event-referrer',
    userAgent: 'event-user-agent-string',
    language: 'te-st',
    country: 'kerbin',
    forwardedIp: '192.168.1.1, 192.168.50.1',
    spanId: 'event-span-1234',
    correlationId: 'event-correlation-1234'
}

it('should forward the request referrer', () => {
    expect(applyTrace(eventDetails, {})).toEqual(expect.objectContaining({
        headers: expect.objectContaining({
            'X-Forwarded-Referrer': 'event-referrer'
        })
    }))
})

it('should forward the user agent string', () => {
    expect(applyTrace(eventDetails, {})).toEqual(expect.objectContaining({
        headers: expect.objectContaining({
            'X-Forwarded-User-Agent': 'event-user-agent-string'
        })
    }))
})

it('should forward the accept language', () => {
    expect(applyTrace(eventDetails, {})).toEqual(expect.objectContaining({
        headers: expect.objectContaining({
            'Accept-Language': 'te-st'
        })
    }))
})

it('should forward the request country information', () => {
    expect(applyTrace(eventDetails, {})).toEqual(expect.objectContaining({
        headers: expect.objectContaining({
            'X-Viewer-Country': 'kerbin'
        })
    }))
})

it('should forward the request ip-address', () => {
    expect(applyTrace(eventDetails, {})).toEqual(expect.objectContaining({
        headers: expect.objectContaining({
            'X-Forwarded-For': '192.168.1.1, 192.168.50.1'
        })
    }))
})

it('should forward the span id', () => {
    expect(applyTrace(eventDetails, {})).toEqual(expect.objectContaining({
        headers: expect.objectContaining({
            'X-Span-Id': 'event-span-1234'
        })
    }))
})

it('should forward the correlation id', () => {
    expect(applyTrace(eventDetails, {})).toEqual(expect.objectContaining({
        headers: expect.objectContaining({
            'X-Correlation-Id': 'event-correlation-1234'
        })
    }))
})
