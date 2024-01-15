import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
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
export const enhance = (options: EnhanceOptions) => {
    const {service, name = 'lambda-handler', onResponse = rsp => rsp} = options;
    return (lambda: LambdaEventHandler<APIGatewayProxyEvent, APIGatewayProxyResult>) => {
        const promiseLambda = wrapLambdaCompletionWithPromise(lambda);
        return (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
            return Journal.createSpan(async () => {
                setLambdaEventContext(event, context);
                logEventStart(service, name);

                let result = serverError() as APIGatewayProxyResult
                try {
                    result = await promiseLambda(event, context);
                } catch (err) {
                    Journal.exception(err);
                } finally {
                    logEventEnd(result);
                }

                return onResponse(result as APIGatewayProxyResult, event);
            });
        }
    };
};

export default enhance;