import {deepMerge} from './deep-merge';
import Journal from "@byaga/journal";
import {APIGatewayProxyEvent} from "aws-lambda";

/**
 * Applies the user data to the request object
 */
export const applyUser = (
    request: APIGatewayProxyEvent = {} as unknown as APIGatewayProxyEvent
): APIGatewayProxyEvent =>
    deepMerge(request, Journal.get('event-user-data'));

export default applyUser;
