const eventData = require("./lib/event-data");
const {serverError} = require("./response");

const enhance = ({
                     logger, onResponse = rsp => rsp
                 }, lambda) => {
    logger.configure({
        write: data => process.stdout.write(JSON.stringify(data).replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '\r\n')
    });
    logger.annotate({
        'meta.region': process.env.AWS_REGION
    });

    return async (event, context = {}) => {
        const span = logger ? logger.beginSpan() : null;
        const details = eventData(event, context);

        span.annotate({
            'trace.span_id': details.spanId,
            'trace.parent_id': details.parentId,
            'trace.correlation_id': details.correlationId,
            'trace.request_id': details.requestId,
            'meta.function_version': context.functionVersion,
            'meta.function_name': context.functionName,
            'meta.function_arn': context.invokedFunctionArn,
            'meta.log_group': context.logGroupName,
            'meta.log_stream': context.logStreamName
        });
        let result;
        try {
            result = await lambda(event, {
                ...context,
                logger: span,
                details
            });
        } catch (err) {
            span.exception(err);
            return onResponse(serverError())
        } finally {
            const pathData = Object.entries(event.pathParameters || {}).reduce((data, [k, v]) => {
                data[`request.params.${k}`] = v;
                return data;
            }, {});
            span.end({
                message: 'Lambda Execution',
                'request.user_agent': details.userAgent,
                'request.referrer': details.referrer,
                'request.device_type': details.deviceType,
                'request.country': details.country,
                'request.ip_address': details.ipAddress,
                'request.host': details.host,
                'request.method': details.httpMethod,
                'response.status': result ? result.statusCode : 500,
                'metrics.execution_time_remaining_ms': context.getRemainingTimeInMillis ? context.getRemainingTimeInMillis() : undefined, ...pathData
            });
        }

        return onResponse(result);
    };
};

module.exports = enhance;