import {InvokeCommand} from "@aws-sdk/client-lambda";
import Journal from '@byaga/journal';
import {applyTrace} from "./apply-trace";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {client} from "./client-lambda";

/**
 * Invokes a Lambda function and returns the response.
 *
 * This function sends an InvokeCommand to AWS Lambda to invoke a function with the specified name and parameters.
 * It applies tracing to the parameters before invoking the function.
 * If the function invocation fails, it annotates the error in the Journal and returns an error object.
 * If the function invocation succeeds, it parses the payload from the response, annotates the status code and any error in the Journal, and returns the payload.
 *
 * @param  functionName - The name of the Lambda function to invoke.
 * @param  params - The parameters to pass to the Lambda function.
 * @returns A promise that resolves with the payload from the Lambda function response, or an error object if the function invocation fails.
 *
 * @example
 *
 * invokeLambda('my-function', { key: 'value' })
 *   .then(payload => console.log(payload))
 *   .catch(console.error);
 */
export const invokeLambda = async (functionName: string, params: APIGatewayProxyEvent | object = {}): Promise<InvokeResult> => {
    const done = Journal.startTimer(functionName);
    try {
        const result = await client.send(new InvokeCommand({
            FunctionName: functionName,
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify(applyTrace(params as APIGatewayProxyEvent))
        }));

        if (result.StatusCode && result.StatusCode >= 300) {
            Journal.annotate({
                error: "Lambda Execution Failed",
                'error.detail': result.FunctionError,
            });
            return {error: result};
        }

        const payload = JSON.parse(Buffer.from(new TextDecoder().decode(result.Payload)).toString());
        if (payload.body && typeof payload.body === 'string' && payload.headers["Content-Type"] === "application/json") {
            payload.body = JSON.parse(payload.body);
        }
        if (payload.statusCode) Journal.annotate(`app.${functionName}.status_code`, payload.statusCode);
        if (payload.body?.error) Journal.annotate(`app.${functionName}.error`, payload.body.error);

        return {result: payload};
    } catch (error) {
        Journal.exception(error)
        return {error}
    } finally {
        done()
    }
}

export interface InvokeResult {
    result?: APIGatewayProxyResult,
    error?: unknown
}

export default invokeLambda;