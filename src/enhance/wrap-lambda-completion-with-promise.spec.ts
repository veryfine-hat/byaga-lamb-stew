import {
    LambdaEventCallbackHandler,
    LambdaEventPromiseHandler,
    wrapLambdaCompletionWithPromise
} from './wrap-lambda-completion-with-promise';
import {Context} from 'aws-lambda';

jest.mock('aws-lambda');

const context: Context = {} as Context;

it('handles lambda function that uses callback to succeed', async () => {
    const event = 'testEvent';
    const result = 'testResult';
    const lambda: LambdaEventCallbackHandler<typeof event, typeof result> = (event, context, callback) => callback(null, result);
    const wrappedLambda = wrapLambdaCompletionWithPromise(lambda);
    await expect(wrappedLambda(event, context)).resolves.toBe(result);
});

it('handles lambda function that uses callback to fail', async () => {
    const event = 'testEvent';
    const error = new Error('testError');
    const lambda: LambdaEventCallbackHandler<typeof event, void> = (event, context, callback) => callback(error);
    const wrappedLambda = wrapLambdaCompletionWithPromise(lambda);
    await expect(wrappedLambda(event, context)).rejects.toBe(error);
});

it('handles lambda function that returns a promise that resolves', async () => {
    const event = 'testEvent';
    const result = 'testResult';
    const lambda: LambdaEventPromiseHandler<typeof event, typeof result> = async () => result;
    const wrappedLambda = wrapLambdaCompletionWithPromise(lambda);
    await expect(wrappedLambda(event, context)).resolves.toBe(result);
});

it('handles lambda function that returns a promise that rejects', async () => {
    const event = 'testEvent';
    const error = new Error('testError');
    const lambda: LambdaEventPromiseHandler<typeof event, void> = async () => {
        throw error;
    };
    const wrappedLambda = wrapLambdaCompletionWithPromise(lambda);
    await expect(wrappedLambda(event, context)).rejects.toBe(error);
});