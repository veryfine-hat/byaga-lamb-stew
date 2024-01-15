import Journal from '@byaga/journal';
import {APIGatewayEventIdentity} from "aws-lambda/common/api-gateway";
import {UserDetails} from "./UserDetails";

/**
 * This function is used to extract user data from the identity object in an API Gateway event.
 * It first checks if the user property is present in the identity object, if not it returns null.
 * If the user property is present, it returns an object with the user id (sub) and an empty groups array.
 * It also stores the event data in the Journal for further use.
 *
 * @param {APIGatewayEventIdentity} identity - The identity object from the API Gateway event.
 * @param {Object} eventData - The event data that needs to be stored in the Journal.
 * @returns {UserDetails | null} - The user data if the user property is present in the identity object, or null if not.
 */
export function userDataFromIdentity(identity: APIGatewayEventIdentity, eventData: object): UserDetails | null {
    // Check if the user property is present in the identity object
    if (!identity.user) return null;

    // Store the event data in the Journal
    Journal.setContextValue('event-user-data', eventData, true)

    // Return the user data
    return {
        sub: identity.user,
        groups: []
    };
}