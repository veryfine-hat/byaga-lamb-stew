import {Context} from 'aws-lambda';
import {serverError} from '../response';
import Journal from '@byaga/journal';
import {setLambdaEventContext} from "./event-details";
import logEventStart from "./log-event-start";
import logEventEnd from "./log-event-end";
import {EnhanceOptions} from "./EnhanceOptions";
import "./initialize-journal"
import {LambdaEventHandler, wrapLambdaCompletionWithPromise} from "./wrap-lambda-completion-with-promise";

/**
 * This function is a higher-order function that wraps another function (lambda) and adds logging and error handling.
 * It first sets up the logging context, then calls the wrapped function (lambda).
 * If an error occurs while calling the lambda, it logs the error and returns a server error response.
 * It also allows customizing the response by passing an onResponse function in the options.
 *
 * @param options - The options for enhancing the lambda.
 * @returns - The enhanced lambda.
 */
export const enhance = <T, R>(options: EnhanceOptions<T, R>) => {
    return (lambda: LambdaEventHandler<T, R>) => {
        const onResponse = options.onResponse ?? ((response: R): R => response);
        const promiseLambda = wrapLambdaCompletionWithPromise(lambda);
        return (event: T, context: Context): Promise<R> => {
            return Journal.createSpan(async () => {
                setLambdaEventContext(event, context);
                logEventStart(options.service, options.name ?? 'lambda-handler');

                let result = serverError() as R
                try {
                    result = await promiseLambda(event, context);
                } catch (err) {
                    Journal.exception(err);
                } finally {
                    logEventEnd(result);
                }

                return onResponse(result, event);
            });
        }
    };
};

export default enhance;