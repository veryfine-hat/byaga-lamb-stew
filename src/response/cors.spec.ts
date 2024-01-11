import {cors} from './cors';
import Journal from '@byaga/journal';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

let getSpy: jest.SpyInstance;
beforeEach(() => {
    jest.clearAllMocks()
    getSpy = jest.spyOn(Journal, 'get');
})

it('adds cors headers to the response', () => {
    const event: APIGatewayProxyEvent = {
        headers: {
            'X-Forwarded-Referrer': 'https://test-referrer.com/test/path',
            'User-Agent': 'test-user-agent',
            'Accept-Language': 'test-language',
            'Cache-Control': 'test-cache-control',
            'X-Viewer-Country': 'test-country',
            'X-Forwarded-For': 'test-ip',
            'X-Span-Id': 'test-span-id',
            'X-Correlation-Id': 'test-correlation-id',
            'Content-Type': 'test-content-type',
            'Content-Length': 'test-content-length',
            'Authorization': 'test-authorization'
        }
    }as unknown as APIGatewayProxyEvent;

    getSpy.mockReturnValue(event);

    const response: APIGatewayProxyResult = { statusCode: 200, body: "" }
    const result = cors(response);

    expect(result).toEqual(expect.objectContaining({
        headers: expect.objectContaining({
            'Access-Control-Allow-Methods': 'GET,OPTIONS,PUT,POST,PATCH,DELETE',
            'Access-Control-Allow-Headers': 'X-Forwarded-Referrer,Referrer,Referer,Host,X-Forwarded-User-Agent,User-Agent,Accept-Language,Cache-Control,X-Viewer-Country,X-Forwarded-For,X-Span-Id,X-Correlation-Id,Content-Type,Content-Length,Authorization',
            'Access-Control-Expose-Headers': 'Date',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': 86400,
            Vary: 'Origin'
        })
    }));
});

it('Can set the origin to the referrer origin with default configuration', () => {
    const event: APIGatewayProxyEvent = {
        headers: {
            'X-Forwarded-Referrer': 'https://test-referrer.com/test/path'
        }
    } as unknown as APIGatewayProxyEvent;

    getSpy.mockReturnValue(event);

    const response: APIGatewayProxyResult = { statusCode: 200, body: "" }
    const result = cors(response);

    expect(result).toEqual(expect.objectContaining({
        headers: expect.objectContaining({
            'Access-Control-Allow-Origin': 'https://test-referrer.com'
        })
    }));
});

it('adds cors headers to the response with custom options', () => {
    const event: APIGatewayProxyEvent = {
        headers: {
            'X-Forwarded-Referrer': 'https://test-referrer.com/test/path',
            'User-Agent': 'test-user-agent',
            'Accept-Language': 'test-language',
            'Cache-Control': 'test-cache-control',
            'X-Viewer-Country': 'test-country',
            'X-Forwarded-For': 'test-ip',
            'X-Span-Id': 'test-span-id',
            'X-Correlation-Id': 'test-correlation-id',
            'Content-Type': 'test-content-type',
            'Content-Length': 'test-content-length',
            'Authorization': 'test-authorization'
        }
    } as unknown as APIGatewayProxyEvent;

    getSpy.mockReturnValue(event);

    const response: APIGatewayProxyResult = { statusCode: 200, body: "" };
    const options = {
        origin: 'test-origin',
        methods: ['GET', 'POST'],
        headers: ['Content-Type', 'Authorization'],
        exposeHeaders: ['Content-Length']
    };
    const result = cors(response, options);

    expect(result).toEqual(expect.objectContaining({
        headers: expect.objectContaining({
            'Access-Control-Allow-Origin': 'test-origin',
            'Access-Control-Allow-Methods': 'GET,POST',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Expose-Headers': 'Content-Length',
            'Access-Control-Allow-Credentials': 'true'
        })
    }));
});