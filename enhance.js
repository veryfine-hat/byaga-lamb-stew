const eventData = require("./lib/event-data");
const {serverError} = require("./response");
const cors = require("./response/cors");
const Context = require('./context');

const enhance = ({ name, logger, onResponse = rsp => rsp, enableCors }, lambda) => {
    const buildResponse = (rsp, event) => {
        if (enableCors) {
            rsp = cors(event, rsp, enableCors === true ? undefined : enableCors)
        }
        return onResponse(rsp)
    }
    Context.configure({logger})
    logger.configure({
        write: data => process.stdout.write(JSON.stringify(data).replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '\r\n')
    });
    logger.annotate({
        'meta.region': process.env.AWS_REGION
    });

    const handler = async (event, context, ...args) => {
        Context.setContext('event', event, true)
        Context.setContext('context', context, true)
        const details = eventData();

        Context.annotate({
            'service_name': name,
            'trace.trace_id': details.traceId,
            'trace.correlation_id': details.correlationId,
            'trace.request_id': details.requestId,
            'meta.function_version': context.functionVersion,
            'meta.function_name': context.functionName,
            'meta.function_arn': context.invokedFunctionArn,
            'meta.log_group': context.logGroupName,
            'meta.log_stream': context.logStreamName
        }, {cascade: true});
        Context.annotate({
            'name': 'lambda-handler',
            'trace.span_id': details.spanId,
            'trace.parent_id': details.parentId
        });
        let result;
        try {
            result = await lambda(event, context, ...args);
        } catch (err) {
            Context.exception(err);
            return buildResponse(serverError(), event)
        } finally {
            const pathData = Object.entries(event.pathParameters || {}).reduce((data, [k, v]) => {
                data[`request.params.${k}`] = v;
                return data;
            }, {});
            Context.annotate({
                'request.user_agent': details.userAgent,
                'request.referrer': details.referrer,
                'request.device_type': details.deviceType,
                'request.country': details.country,
                'request.ip_address': details.ipAddress,
                'request.host': details.host,
                'request.method': details.httpMethod,
                'response.status': result ? result.statusCode : 500,
                'response.content_length': result?.headers ? result?.headers['Content-Length'] : undefined,
                'metrics.execution_time_remaining_ms': context.getRemainingTimeInMillis ? context.getRemainingTimeInMillis() : undefined, ...pathData
            });
        }

        return buildResponse(result, event);
    };
    return  Context.withChildSpan(handler)
};

module.exports = enhance