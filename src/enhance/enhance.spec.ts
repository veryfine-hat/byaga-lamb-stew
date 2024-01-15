import {enhance} from "./enhance";
import {v4} from 'uuid';
import Journal from "@byaga/journal";
import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import {StructuredLog} from "@byaga/journal/lib/StructuredLog";

jest.mock('uuid');
const uuid = jest.mocked(v4);
const context: Context = {
    functionName: 'test-lambda',
    functionVersion: '99',
    awsRequestId: 'request-id-4321',
    invokedFunctionArn: 'arn:aws:lambda:us-test-2:123456789012:function:test-lambda:99',
    memoryLimitInMB: '128',
    logGroupName: '/aws/lambda/test-lambda',
    logStreamName: '2015/09/22/[HEAD]13370a84ca4ed8b77c427af260',
    identity: {
        cognitoIdentityId: '',
        cognitoIdentityPoolId: '',
    },
    callbackWaitsForEmptyEventLoop: true,
    getRemainingTimeInMillis(): number { return 0; },
    done(): void { return; },
    fail(): void { return; },
    succeed(): void { return; },
}
const runTest = (event: Record<string, unknown>, context: Context = {} as Context) => {
    const annotateSpy = jest.spyOn(Journal, 'annotate');
    const exceptionSpy = jest.spyOn(Journal, 'exception');
    const withChildSpan = jest.spyOn(Journal, 'withChildSpan');
    const testMe = jest.fn().mockResolvedValue({ 'a': 'result' })
    const write = jest.fn((data: StructuredLog) => process.stdout.write(JSON.stringify(data).replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '\r\n'))
    Journal.configure({ write });
    const lambda = enhance({
        service: 'lamb-stew',
        name: 'enhance-test'
    })(testMe);

    return {
        logger: {
            annotate: annotateSpy,
            exception: exceptionSpy,
            withChildSpan,
            write
        },
        lambda: testMe,
        exec: () => {
            return lambda(event as unknown as APIGatewayProxyEvent, context)
        }
    };
};

it('should log an end event after the lambda is executed', async () => {
    const event = {an: 'event'}
    const {
        exec,
        logger
    } = runTest(event);
    await exec();

    expect(logger.write).toHaveBeenCalledWith(expect.objectContaining({
        service_name: 'lamb-stew',
        name: 'enhance-test'
    }));
});

it('should attach trace headers to future logs', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        headers: {
            'x-span-id': 'parent-4321'
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();

    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'trace.span_id': 'uuid-v4-result',
        'trace.parent_id': 'parent-4321'
    }));
});

it('should attach the user agent to the end log', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        headers: {
            'x-span-id': 'parent-4321',
            'User-Agent': 'user agent string'
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();

    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.user_agent': 'user agent string'
    }));
});

it('should attach the referrer to the end log', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        headers: {
            'referrer': 'referrer',
            'referer': 'referer'
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();

    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.referrer': 'referrer'
    }));
});

it('should attach the referer to the end log if referrer is not found', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        headers: {
            'referer': 'referer'
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();

    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.referrer': 'referer'
    }));
});

it('should detect desktop devices', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        headers: {
            'CloudFront-Is-Desktop-Viewer': "true",
            'CloudFront-Is-Mobile-Viewer': "false",
            'CloudFront-Is-SmartTV-Viewer': "false",
            'CloudFront-Is-Tablet-Viewer': "false"
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();

    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.device_type': 'desktop'
    }));
});

it('should detect Mobile devices', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        headers: {
            'CloudFront-Is-Desktop-Viewer': "false",
            'CloudFront-Is-Mobile-Viewer': "true",
            'CloudFront-Is-SmartTV-Viewer': "false",
            'CloudFront-Is-Tablet-Viewer': "false"
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();

    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.device_type': 'mobile'
    }));
});

it('should detect SmartTV devices', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        headers: {
            'CloudFront-Is-Desktop-Viewer': "false",
            'CloudFront-Is-Mobile-Viewer': "false",
            'CloudFront-Is-SmartTV-Viewer': "true",
            'CloudFront-Is-Tablet-Viewer': "false"
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.device_type': 'smarttv'
    }));
});

it('should detect tablet devices', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        headers: {
            'CloudFront-Is-Desktop-Viewer': "false",
            'CloudFront-Is-Mobile-Viewer': "false",
            'CloudFront-Is-SmartTV-Viewer': "false",
            'CloudFront-Is-Tablet-Viewer': "true"
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.device_type': 'tablet'
    }));
});

it('should attach country to the end log', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        headers: {
            'CloudFront-Viewer-Country': 'estonia'
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.country': 'estonia'
    }));
});

it('should attach ip address to the end log', async () => {
    const event = {
        headers: {
            'X-Forwarded-For': '192.168.1.1, 192.168.50.1'
        },
        requestContext: {
            identity: {
                sourceIp: '192.168.1.1'
            }
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.ip_address': '192.168.1.1'
    }));
});

it('should attach the correlation id to future logs', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        headers: {
            'X-Correlation-Id': 'corr-id-1234'
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'trace.correlation_id': 'corr-id-1234'
    }), {cascade: true});
});

it('should attach the request id to future logs', async () => {
    uuid.mockReturnValue('uuid-v4-result');
    const event = {
        requestContext: {
            requestId: 'request-id-4321'
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'trace.request_id': 'request-id-4321'
    }), {cascade: true});
});

it('should attach the function name to all logs', async () => {
    const event = {};
    const {
        logger,
        exec
    } = runTest(event, context);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'meta.function_name': 'test-lambda'
    }), {cascade: true});
});

it('should attach the region to all logs', async () => {
    process.env.AWS_REGION = 'us-test-2';
    const event = {};
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'meta.region': 'us-test-2'
    }), {"cascade": true});
});

it('should attach the function version to all logs', async () => {
    const event = {};
    const {
        logger,
        exec
    } = runTest(event, context);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'meta.function_version': '99'
    }), {cascade: true});
});


it('should log exceptions during lambda execution', async () => {
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '99';
    const event = {};
    const {
        logger,
        lambda,
        exec
    } = runTest(event);
    lambda.mockRejectedValue(new Error('Bang'));
    await exec().catch(() => {
    });

    expect(logger.exception).toHaveBeenCalledWith(new Error('Bang'));
});

it('should return the lambda result back to the caller', async () => {
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '99';
    const event = {};
    const {
        lambda,
        exec
    } = runTest(event);
    lambda.mockResolvedValue('Some Result');

    return expect(exec()).resolves.toEqual('Some Result');
});

it('should catch uncaught exceptions thrown in the lambda code', async () => {
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '99';
    const event = {};
    const {
        lambda,
        exec
    } = runTest(event);
    lambda.mockRejectedValue(new Error('Bang'));

    return expect(exec()).resolves.toEqual(expect.objectContaining({
        statusCode: 500
    }));
});

it('should attach the request method to the end log', async () => {
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '99';
    const event = {
        httpMethod: 'PATCH'
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.method': 'patch'
    }));
});

it('should attach the request path to the end log', async () => {
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '99';
    const event = {
        httpMethod: 'PATCH'
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.method': 'patch'
    }));
});

it('should attach path parameters to the end log', async () => {
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '99';
    const event = {
        pathParameters: {
            id: '1234',
            name: 'test'
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.params.id': '1234',
        'request.params.name': 'test'
    }));
});

it('should attach the request host to the end log', async () => {
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '99';
    const event = {
        headers: {
            'Host': 'jest-test'
        }
    };
    const {
        logger,
        exec
    } = runTest(event);
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'request.host': 'jest-test'
    }));
});

it('should attach the response status code to the end log', async () => {
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '99';
    const event = {
        headers: {
            'Host': 'jest-test'
        }
    };
    const {
        logger,
        exec,
        lambda
    } = runTest(event);
    lambda.mockResolvedValue({statusCode: 299});
    await exec();


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'response.status': 299
    }));
});

it('should log the status as 500 if the lambda throws an exception', async () => {
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '99';
    const event = {
        headers: {
            'Host': 'jest-test'
        }
    };
    const {
        logger,
        exec,
        lambda
    } = runTest(event);
    lambda.mockRejectedValue(new Error('Bang!!!'));
    await exec().catch(() => {
    });


    expect(logger.annotate).toHaveBeenCalledWith(expect.objectContaining({
        'response.status': 500
    }));
});
