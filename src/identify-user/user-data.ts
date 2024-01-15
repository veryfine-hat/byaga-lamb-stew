import Journal from "@byaga/journal";
import {JsonWebTokenPayload} from "./JsonWebTokenPayload";
import {APIGatewayEventIdentity} from "aws-lambda/common/api-gateway";

const USER_DATA_CONTEXT_KEY = 'event-user-data';


export interface UserEventDetails {
    requestContext: {
        authorizer: { claims: JsonWebTokenPayload },
        identity?: APIGatewayEventIdentity
    },
    headers?: {Authorization: string }
}
/**
 * Stores the user data in the Journal for further use.
 * @param userData
 */
export const setUserData = (userData: UserEventDetails): void => {Journal.setContextValue(USER_DATA_CONTEXT_KEY, userData, true)};

/**
 * Returns the user data from the Journal.
 * @returns {UserDetails}
 */
export const getUserData = (): UserEventDetails => Journal.getContextValue(USER_DATA_CONTEXT_KEY) as UserEventDetails;