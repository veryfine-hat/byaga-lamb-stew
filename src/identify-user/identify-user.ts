import Journal from '@byaga/journal';
import {APIGatewayProxyEvent} from "aws-lambda";
import {userDataFromRequestContext} from "./user-data-from-request-context";
import {userDataFromAuthToken} from "./user-data-from-auth-token";

/**
 * Function to identify the user from the request context or the authorization token.
 * If the user is identified, the user data is stored in the Journal and annotations are added for the user id and groups.
 * If the user is not identified, an error is returned.
 *
 * @returns {Object} - An object containing the user data if the user is identified, or an error message if not.
 */
export const identifyUser = () => {
    // Get the headers and request context from the event stored in the Journal
    const event = Journal.get('event') || {} as APIGatewayProxyEvent;
    const { headers, requestContext } = event;

    // Try to get the user data from the request context, if not available try to get it from the authorization token
    const userData = userDataFromRequestContext(requestContext) || userDataFromAuthToken(headers?.Authorization);

    // If user data is available
    if (userData) {
        // Store the user data in the Journal
        Journal.set('user', userData, true);
        // Add an annotation for the user id
        Journal.annotate('user.user_id', userData.sub);
        // For each group the user belongs to, add an annotation
        userData.groups.forEach(group => {
            Journal.annotate(`user.groups.${group}`, true);
        });
    }

    // If no user data is found, return an error, otherwise return the user data
    return !userData ? {error: "No Auth Found"} : {data: userData};
};