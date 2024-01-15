import {AuthClaims} from "./AuthClaims";
import {UserDetails} from "./UserDetails";
import {setUserData, UserEventDetails} from "./user-data";

/**
 * This function is used to extract user data from the claims in an authorization token.
 * It first checks if the groups claim is present, if not it defaults to an empty array.
 * Then it returns an object with the user id (sub), groups, and email from the claims.
 * It also stores the event data in the Journal for further use.
 *
 * @param {AuthClaims} claims - The claims from the authorization token.
 * @param {Object} eventData - The event data that needs to be stored in the Journal.
 * @returns {UserDetails | null} - The user data if the sub claim is present, or null if not.
 */
export function userDataFromClaims(claims: AuthClaims, eventData: UserEventDetails): UserDetails | null {
    // Check if the groups claim is present, if not default to an empty array
    const groups = claims['cognito:groups'] || claims.groups || [];
    // Store the event data in the Journal

    setUserData(eventData)

    // Return the user data if the sub claim is present, or null if not
    return {
        sub: claims.sub,
        groups: Array.isArray(groups) ? groups : [groups],
        email: claims.email
    };
}