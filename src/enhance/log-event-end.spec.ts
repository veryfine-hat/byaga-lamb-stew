import {logEventEnd} from './log-event-end';
import * as getEventDataModule from '../get-event-data';
import * as getLambdaContextModule from './event-details';
import * as getLambdaEventModule from './event-details';
import Journal from '@byaga/journal';
import {APIGatewayProxyResult, Context} from 'aws-lambda';

jest.mock('../get-event-data');
jest.mock('./event-details');
jest.mock('@byaga/journal');

const context: Context = {
    getRemainingTimeInMillis: jest.fn().mockReturnValue(42)
} as unknown as Context;
const event = {pathParameters: {id: '1234', name: 'test'}};
const result: APIGatewayProxyResult = {statusCode: 200, headers: {'Content-Length': '100'}, body: ''};
const mockEventData = {
    userAgent: 'testUserAgent',
    referrer: 'testReferrer',
    deviceType: 'testDeviceType',
    country: 'testCountry',
    ipAddress: 'testIpAddress',
    host: 'testHost',
    httpMethod: 'testHttpMethod'
};
const annotateSpy = jest.spyOn(Journal, 'annotate');

beforeEach(() => {
    (getEventDataModule.default as jest.Mock).mockReturnValue(mockEventData);
    (getLambdaContextModule.getLambdaContext as jest.Mock).mockReturnValue(context);
    (getLambdaEventModule.getLambdaEvent as jest.Mock).mockReturnValue(event);
});

it('annotates the journal with request and response details', () => {
    logEventEnd(result);
    const headers = result.headers ?? {};

    expect(annotateSpy).toHaveBeenCalledWith({
        'request.user_agent': mockEventData.userAgent,
        'request.referrer': mockEventData.referrer,
        'request.device_type': mockEventData.deviceType,
        'request.country': mockEventData.country,
        'request.ip_address': mockEventData.ipAddress,
        'request.host': mockEventData.host,
        'request.method': mockEventData.httpMethod,
        'response.status': result.statusCode,
        'response.content_length': headers['Content-Length'],
        'metrics.execution_time_remaining_ms': context.getRemainingTimeInMillis(),
        'request.params.id': event.pathParameters.id,
        'request.params.name': event.pathParameters.name
    });
});

it('annotates the journal with status code 500 when result is undefined', () => {
    logEventEnd(undefined as unknown as APIGatewayProxyResult);

    expect(annotateSpy).toHaveBeenCalledWith(expect.objectContaining({
        'response.status': 500
    }));
});

it('annotates the journal with undefined content length when result headers are undefined', () => {
    logEventEnd({statusCode: 200, headers: undefined, body: ''});

    expect(annotateSpy).toHaveBeenCalledWith(expect.objectContaining({
        'response.content_length': undefined
    }));
});