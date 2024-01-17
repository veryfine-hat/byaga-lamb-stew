import eventData from '../get-event-data';
import Journal from '@byaga/journal';
import {getLambdaContext} from "./event-details";

/**
 * Records standard event information available at the start of lambda execution.
 * @function logEventStart
 * @param {string} service - The name of the service this lambda is part of.
 * @param {string} name - The name of the lambda.
 */
export const logEventStart = (service: string, name: string = 'lambda-handler') => {
    const context = getLambdaContext();
    const details = eventData();

    /**
     * Annotate the journal with service details and trace information.
     */
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
        'name': name,
        'trace.span_id': details.spanId,
        'trace.parent_id': details.parentId
    });
};

export default logEventStart;