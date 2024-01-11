import {APIGatewayEventDefaultAuthorizerContext} from "aws-lambda";
import {APIGatewayEventRequestContextWithAuthorizer} from "aws-lambda/common/api-gateway";
import {userDataFromClaims} from "./user-data-from-claims";
import {UserDetails} from "./UserDetails";
import {userDataFromIdentity} from "./user-data-from-identity";

/**
 * This function is used to extract user data from the request context of an API Gateway event.
 * It first checks if the claims are present in the authorizer of the request context, if so it uses them to get the user data.
 * If the claims are not present, it checks if the identity object is present in the request context, if so it uses it to get the user data.
 * If neither the claims nor the identity object are present, it returns null.
 *
 * @param {APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>} requestContext - The request context from the API Gateway event.
 * @returns {UserDetails | null} - The user data if the claims or the identity object are present in the request context, or null if not.
 */
export function userDataFromRequestContext(requestContext: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>): UserDetails | null {
    // Check if the claims are present in the authorizer of the request context
    if (requestContext?.authorizer?.claims)
        // If so, use them to get the user data
        return userDataFromClaims(requestContext.authorizer.claims, {
            requestContext: {authorizer: {claims: requestContext.authorizer.claims}}
        });
    // If the claims are not present, check if the identity object is present in the request context
    if (requestContext?.identity)
        // If so, use it to get the user data
        return userDataFromIdentity(requestContext.identity, {
            requestContext: {identity: requestContext.identity}
        });
    // If neither the claims nor the identity object are present, return null
    return null;
}