import getEventData from './get-event-data';
import { v4 } from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import {getLambdaContext, getLambdaEvent} from "./enhance/event-details";
import Journal from "@byaga/journal";

jest.mock('uuid');
jest.mock('@byaga/journal');
jest.mock('./enhance/event-details');

let detailedEvent: APIGatewayProxyEvent;

const uuid = jest.mocked(v4)
beforeEach(() => {
    jest.clearAllMocks();
    (getLambdaEvent as jest.Mock).mockReturnValue({
        headers: {
            referer: 'referer-header',
            Host: 'request.host',
            'User-Agent': 'user agent',
            'Accept-Language': 'german',
            'Cache-Control': 'cache forever',
            'Cloudfront-Viewer-Country': 'france',
            'X-Span-Id': 'parent span id'
        },
        httpMethod: 'PoSt',
        multiValueHeaders: {},
        path: 'path/to/handler',
        requestContext: {
            stage: 'unit-test',
            requestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
            requestTimeEpoch: 1428582896000,
            identity: {
                sourceIp: '123.234.432.321'
            }
        },
    });
    (getLambdaContext as jest.Mock).mockReturnValue({});
    detailedEvent = getLambdaEvent();
});

it('should set the path to the event path', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        path: 'path/to/handler'
    }));
});

it('should set the httpMethod as a lowercase event.httpMethod', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        httpMethod: 'post'
    }));
});

it('should set the referrer to the x-forwarded-referrer header if available', () => {
    detailedEvent.headers['X-Forwarded-Referrer'] = 'forwarded-referer'
    detailedEvent.headers['Referrer'] = 'referrer-header'
    expect(getEventData()).toEqual(expect.objectContaining({
        referrer: 'forwarded-referer'
    }));
});

it('should set the referrer to the referrer header if available', () => {
    detailedEvent.headers['Referrer'] = 'referrer-header'
    expect(getEventData()).toEqual(expect.objectContaining({
        referrer: 'referrer-header'
    }));
});

it('should set the referrer to the referer header', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        referrer: 'referer-header'
    }));
});

it('should set host to the host header', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        host: 'request.host'
    }));
});

it('should set the userAgent to the x-forwarded-user-agent header if available', () => {
    detailedEvent.headers['x-forwarded-user-agent'] = 'forwarded agent'
    expect(getEventData()).toEqual(expect.objectContaining({
        userAgent: 'forwarded agent'
    }));
});

it('should set the userAgent to the user-agent header', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        userAgent: 'user agent'
    }));
});

it('should set the language tot he accept language', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        language: 'german'
    }));
});

it('should set the cacheControl to the cache-control header', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        cacheControl: 'cache forever'
    }));
});

it('should set isDesktop to true if cloudfront-is-desktop-viewer is true', () => {
    detailedEvent.headers['Cloudfront-Is-Desktop-Viewer'] = 'true'
    expect(getEventData()).toEqual(expect.objectContaining({
        isDesktop: true
    }));
});

it('should set isDesktop to false if cloudfront-is-desktop-viewer is false', () => {
    detailedEvent.headers['Cloudfront-Is-Desktop-Viewer'] = 'false'
    expect(getEventData()).toEqual(expect.objectContaining({
        isDesktop: false
    }));
});

it('should set isMobile to true if cloudfront-is-mobile-viewer is true', () => {
    detailedEvent.headers['Cloudfront-Is-Mobile-Viewer'] = 'true'
    expect(getEventData()).toEqual(expect.objectContaining({
        isMobile: true
    }));
});

it('should set isMobile to false if cloudfront-is-mobile-viewer is false', () => {
    detailedEvent.headers['Cloudfront-Is-Mobile-Viewer'] = 'false'
    expect(getEventData()).toEqual(expect.objectContaining({
        isMobile: false
    }));
});

it('should set isSmartTv to true if cloudfront-is-smartTV-viewer is true', () => {
    detailedEvent.headers['Cloudfront-Is-SmartTV-Viewer'] = 'true'
    expect(getEventData()).toEqual(expect.objectContaining({
        isSmartTv: true
    }));
});

it('should set isSmartTv to false if cloudfront-is-smartTV-viewer is false', () => {
    detailedEvent.headers['Cloudfront-Is-SmartTV-Viewer'] = 'false'
    expect(getEventData()).toEqual(expect.objectContaining({
        isSmartTv: false
    }));
});

it('should set isTablet to true if cloudfront-is-tablet-viewer is true', () => {
    detailedEvent.headers['Cloudfront-Is-Tablet-Viewer'] = 'true'
    expect(getEventData()).toEqual(expect.objectContaining({
        isTablet: true
    }));
});

it('should set isTablet to false if cloudfront-is-tablet-viewer is false', () => {
    detailedEvent.headers['Cloudfront-Is-Tablet-Viewer'] = 'false'
    expect(getEventData()).toEqual(expect.objectContaining({
        isTablet: false
    }));
});

it('should set deviceType to desktop if cloudfront-is-desktop-viewer is true', () => {
    detailedEvent.headers['Cloudfront-Is-Desktop-Viewer'] = 'true'
    expect(getEventData()).toEqual(expect.objectContaining({
        deviceType: 'desktop'
    }));
});

it('should set deviceType to mobile if cloudfront-is-mobile-viewer is true', () => {
    detailedEvent.headers['Cloudfront-Is-Mobile-Viewer'] = 'true'
    expect(getEventData()).toEqual(expect.objectContaining({
        deviceType: 'mobile'
    }));
});

it('should set deviceType to smarttv if cloudfront-is-smarttv-viewer is true', () => {
    detailedEvent.headers['Cloudfront-Is-SmartTV-Viewer'] = 'true'
    expect(getEventData()).toEqual(expect.objectContaining({
        deviceType: 'smarttv'
    }));
});

it('should set deviceType to tablet if cloudfront-is-tablet-viewer is true', () => {
    detailedEvent.headers['Cloudfront-Is-Tablet-Viewer'] = 'true'
    expect(getEventData()).toEqual(expect.objectContaining({
        deviceType: 'tablet'
    }));
});

it('should set deviceType to unknown if none of the cloudfront-is-*-viewer headers are true', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        deviceType: 'unknown'
    }));
});

it('should set country to the x-viewer-country header if available', () => {
    detailedEvent.headers['X-Viewer-Country'] = 'england'
    expect(getEventData()).toEqual(expect.objectContaining({
        country: 'england'
    }));
});

it('should set country to the cloudfront-viewer-country header', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        country: 'france'
    }));
});

it('should set ipAddress to the request identity sourceIp', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        ipAddress: '123.234.432.321'
    }));
});

it('should set forwardedIp to the x-forwarded for header if available', () => {
    detailedEvent.headers['X-Forwarded-For'] = '192.168.1.1, 192.168.50.1'
    expect(getEventData()).toEqual(expect.objectContaining({
        forwardedIp: '192.168.1.1, 192.168.50.1'
    }));
});

it('should set ipAddress to the 1st ip of the x-forwarded for header if available', () => {
    detailedEvent.headers['X-Forwarded-For'] = '192.168.1.2, 192.168.1.1, 192.168.50.1'
    expect(getEventData()).toEqual(expect.objectContaining({
        ipAddress: '192.168.1.2'
    }));
});

it('should set forwardedIp to the request identity source ip', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        forwardedIp: '123.234.432.321'
    }));
});

it('should set stage to the request stage', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        stage: 'unit-test'
    }));
});

it('should set requestId to the request id', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        requestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef"
    }));
});

it('should set spanId to a new uuid', () => {
    uuid.mockReturnValue('1234-4321-1234-4321');
    expect(getEventData()).toEqual(expect.objectContaining({
        spanId: '1234-4321-1234-4321'
    }));
});

it('should set parentId to the x-span-id header', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        parentId: 'parent span id'
    }));
});

it('should set correlationId to the x-correlation-id header if available', () => {
    detailedEvent.headers['X-Correlation-id'] = 'correlation-id'
    expect(getEventData()).toEqual(expect.objectContaining({
        correlationId: 'correlation-id'
    }));
});

it('should set correlationId to the requestId', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        correlationId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef"
    }));
});

it('should set requestTime to an ISO String representing the request epoch time', () => {
    expect(getEventData()).toEqual(expect.objectContaining({
        requestTime: "2015-04-09T12:34:56.000Z"
    }));
});

it('should put all event data on to the journal', () => {
    const data = getEventData()
   expect(Journal.setContextValues).toHaveBeenCalledWith(data, true);
});