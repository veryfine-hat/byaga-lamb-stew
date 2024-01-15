import {logEventStart} from './log-event-start';
import * as getEventDataModule from '../get-event-data';
import * as getLambdaContextModule from './event-details';
import Journal from '@byaga/journal';

jest.mock('../get-event-data');
jest.mock('./event-details');
jest.mock('@byaga/journal');

it('annotates the journal with service details and trace information', () => {
    const service = 'testService';
    const name = 'testName';
    const mockEventData = {
        traceId: 'testTraceId',
        correlationId: 'testCorrelationId',
        requestId: 'testRequestId',
    };
    const mockContext = {
        functionVersion: 'testFunctionVersion',
        functionName: 'testFunctionName',
        invokedFunctionArn: 'testInvokedFunctionArn',
        logGroupName: 'testLogGroupName',
        logStreamName: 'testLogStreamName',
    };
    const annotateSpy = jest.spyOn(Journal, 'annotate');

    (getEventDataModule.default as jest.Mock).mockReturnValue(mockEventData);
    (getLambdaContextModule.getLambdaContext as jest.Mock).mockReturnValue(mockContext);

    logEventStart(service, name);

    expect(annotateSpy).toHaveBeenCalledWith({
        'service_name': service,
        'trace.trace_id': mockEventData.traceId,
        'trace.correlation_id': mockEventData.correlationId,
        'trace.request_id': mockEventData.requestId,
        'meta.region': process.env.AWS_REGION,
        'meta.function_version': mockContext.functionVersion,
        'meta.function_name': mockContext.functionName,
        'meta.function_arn': mockContext.invokedFunctionArn,
        'meta.log_group': mockContext.logGroupName,
        'meta.log_stream': mockContext.logStreamName
    }, {cascade: true});
});

it('annotates the journal with the name of the handler and span details', () => {
    const service = 'testService';
    const name = 'testName';
    const mockEventData = {
        traceId: 'testTraceId',
        correlationId: 'testCorrelationId',
        requestId: 'testRequestId',
        spanId: 'testSpanId',
        parentId: 'testParentId',
    };
    const annotateSpy = jest.spyOn(Journal, 'annotate');

    (getEventDataModule.default as jest.Mock).mockReturnValue(mockEventData);

    logEventStart(service, name);

    expect(annotateSpy).toHaveBeenCalledWith({
        'name': name,
        'trace.span_id': mockEventData.spanId,
        'trace.parent_id': mockEventData.parentId
    });
});