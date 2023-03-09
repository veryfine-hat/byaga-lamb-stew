const eventData = require("./lib/event-data");
const {serverError} = require("./response");
const Journal = require('@byaga/journal');

Journal.configure({
    write: data => process.stdout.write(JSON.stringify(data).replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '\r\n')
});

const enhance = ({ service, name, onResponse = rsp => rsp }, lambda) => {
    const handler = async (event, context, ...args) => {
        Journal.set('event', event, true)
        Journal.set('context', context, true)
        const details = eventData();

        Journal.annotate({
            'service_name': service,
            'name': name || 'lambda-handler',
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
            result = await lambda(event, context, ...args);
        } catch (err) {
            Journal.exception(err);
            return onResponse(serverError(), event)
        } finally {
            const pathData = Object.entries(event.pathParameters || {}).reduce((data, [k, v]) => {
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

        return onResponse(result);
    };
    return Journal.withChildSpan(handler)
};

module.exports = enhance