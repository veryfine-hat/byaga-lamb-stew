import {APIGatewayProxyResult} from 'aws-lambda';
import eventData from '../get-event-data';
import Journal from '@byaga/journal';
import {getLambdaContext, getLambdaEvent} from "./event-details";

/**
 * Record information about how the result of the lambda execution
 * @param result
 */
export const logEventEnd = (result: APIGatewayProxyResult) => {
    const event = getLambdaEvent();
    const context = getLambdaContext();
    const details = eventData();

    const pathData = Object.entries(event.pathParameters || {})
        .reduce((data: Record<string, unknown>, [k, v]) => {
            data[`request.params.${k}`] = v;
            return data;
        }, {});

    Journal.annotate({
        'request.user_agent': details.userAgent,
        'request.referrer': details.referrer,
        'request.device_type': details.deviceType,
        'request.country': details.country,
        'request.ip_address': details.ipAddress,
        'request.host': details.host,
        'request.method': details.httpMethod,
        'response.status': result ? result.statusCode : 500,
        'response.content_length': result?.headers ? result?.headers['Content-Length'] : undefined,
        'metrics.execution_time_remaining_ms': context.getRemainingTimeInMillis ? context.getRemainingTimeInMillis() : undefined,
        ...pathData
    });
};

export default logEventEnd;