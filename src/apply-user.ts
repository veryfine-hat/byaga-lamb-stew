import {deepMerge} from './deep-merge';
import {APIGatewayProxyEvent} from "aws-lambda";
import {getUserData} from "./identify-user/user-data";

/**
 * Applies the user data to the request object
 */
export const applyUser = (
    request: APIGatewayProxyEvent = {} as unknown as APIGatewayProxyEvent
): APIGatewayProxyEvent =>
    deepMerge(request, getUserData() as unknown as Record<string, unknown>);

export default applyUser;
