import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import Journal from '@byaga/journal';

const EVENT_CONTEXT_KEY = 'event-context';
const LAMBDA_CONTEXT_CONTEXT_KEY = 'lambda-context';

/**
 * Sets the event and context in the Journal.
 * @function setLambdaEventContext
 * @param {APIGatewayProxyEvent} event - The event object from the AWS Lambda function.
 * @param {Context} context - The context object from the AWS Lambda function.
 */
export const setLambdaEventContext = (event: APIGatewayProxyEvent, context: Context) => {
    Journal.setContextValue(EVENT_CONTEXT_KEY, event, true)
    Journal.setContextValue(LAMBDA_CONTEXT_CONTEXT_KEY, context || {}, true)
}

/**
 * Retrieves the event from the Journal.
 * @function getLambdaEvent
 * @returns The event object from the AWS Lambda function.
 */
export const getLambdaEvent = () => Journal.getContextValue(EVENT_CONTEXT_KEY) as APIGatewayProxyEvent;

/**
 * Retrieves the context from the Journal.
 * @function getLambdaContext
 * @returns The context object from the AWS Lambda function.
 */
export const getLambdaContext = () => Journal.getContextValue(LAMBDA_CONTEXT_CONTEXT_KEY) as Context;