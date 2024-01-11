import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context} from 'aws-lambda';
import eventData from './get-event-data';
import {serverError} from './response';
import Journal from '@byaga/journal';
import {StructuredLog} from '@byaga/journal/lib/StructuredLog';

Journal.configure({
    write: (data: StructuredLog) => process.stdout.write(JSON.stringify(data).replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '\r\n')
});

export interface EnhanceOptions {
    service: string;
    name?: string;
    onResponse?: (response: APIGatewayProxyResult, event: APIGatewayProxyEvent) => APIGatewayProxyResult;
}

/**
 * This function is a higher-order function that wraps another function (lambda) and adds logging and error handling.
 * It first sets up the logging context, then calls the wrapped function (lambda).
 * If an error occurs while calling the lambda, it logs the error and returns a server error response.
 * It also allows customizing the response by passing an onResponse function in the options.
 *
 * @param options - The options for enhancing the lambda.
 * @returns - The enhanced lambda.
 */
export const enhance = (options: EnhanceOptions) => {
    const {service, name, onResponse = rsp => rsp} = options;
    return (lambda: APIGatewayProxyHandler) => {
        const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) => {
            Journal.set('event', event, true)
            Journal.set('context', context || {}, true)
            const details = eventData();

            Journal.annotate({
                'service_name': service,
                'trace.trace_id': details.traceId,
                'trace.correlation_id': details.correlationId,
                'trace.request_id': details.requestId,
                'meta.region': process.env.AWS_REGION,
                'meta.function_version': context.functionVersion,
                'meta.function_name': context.functionName,
                'meta.function_arn': context.invokedFunctionArn,
                'meta.log_group': context.logGroupName,
                'meta.log_stream': context.logStreamName
            }, {cascade: true});
            Journal.annotate({
                'name': 'lambda-handler',
                'trace.span_id': details.spanId,
                'trace.parent_id': details.parentId
            });
            let result;
            try {
                result = await lambda(event, context, callback);
            } catch (err) {
                Journal.exception(err);
                return onResponse(serverError(), event)
            } finally {
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
            }

            return onResponse(result as APIGatewayProxyResult, event);
        };
        return Journal.withChildSpan(handler, name || 'lambda-handler')
    };
};

export default enhance;