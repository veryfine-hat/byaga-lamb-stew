import {JsonWebTokenPayload} from './JsonWebTokenPayload';

/**
 * This function is used to parse a JWT (Json Web Token) and return the payload as a JsonWebTokenPayload object.
 * It splits the token to get the payload part, then decodes it from base64 and parses it to a JSON object.
 *
 * @param {string} token - The JWT that needs to be parsed.
 * @returns {JsonWebTokenPayload} - The payload of the JWT as a JsonWebTokenPayload object.
 */
export function parseJwt(token: string): JsonWebTokenPayload {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = Buffer.from(base64, 'base64');
    const payload = buff.toString('ascii');
    return payload ? JSON.parse(payload) : {};
}