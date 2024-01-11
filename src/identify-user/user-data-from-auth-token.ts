import {userDataFromClaims} from "./user-data-from-claims";
import {UserDetails} from "./UserDetails";
import {parseJwt} from "./parse-jwt";

/**
 * This function is used to extract user data from the authorization token.
 * It first checks if the authorization header is present, if not it returns null.
 * If the header is present, it extracts the token part by removing the "Bearer " prefix.
 * Then it parses the JWT to get the claims and uses them to get the user data.
 *
 * @param {string | undefined} authHeader - The authorization header from the request.
 * @returns {UserDetails | null} - The user data if the token is valid and contains user data, or null if not.
 */
export function userDataFromAuthToken(authHeader: string | undefined): UserDetails | null {
    // Check if the authorization header is present
    if (!authHeader) return null;

    // Extract the token part by removing the "Bearer " prefix
    const token = authHeader.substring(7 /*"Bearer ".length*/);

    // If the token is not present, return null
    if (!token) return null;

    // Parse the JWT to get the claims
    const claims = parseJwt(token)

    // Use the claims to get the user data and return it
    return userDataFromClaims(parseJwt(token), {
        requestContext: {authorizer: {claims}},
        headers: {Authorization: authHeader}
    });
}