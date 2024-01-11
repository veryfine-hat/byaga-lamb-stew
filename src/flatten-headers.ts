import {APIGatewayProxyEventHeaders} from "aws-lambda";

/**
 * Flattens the headers object by converting all keys to lowercase.
 *
 * This function takes a headers object as a parameter, where the keys are header names and the values are header values.
 * It returns a new headers object where all keys are in lowercase.
 *
 * @param {APIGatewayProxyEventHeaders} headers - The headers object to flatten.
 * @returns {APIGatewayProxyEventHeaders} A new headers object with all keys in lowercase.
 *
 * @example
 *
 * const headers = {
 *   'Content-Type': 'application/json',
 *   'X-Custom-Header': 'custom value'
 * };
 *
 * const flatHeaders = flattenHeaders(headers);
 * // flatHeaders: { 'content-type': 'application/json', 'x-custom-header': 'custom value' }
 */
export const flattenHeaders = (headers: APIGatewayProxyEventHeaders = {}): APIGatewayProxyEventHeaders =>
    Object.entries(headers)
        .reduce((flat: APIGatewayProxyEventHeaders, [key, value]) => {
            flat[key.toLowerCase()] = value;
            return flat;
        }, {});

export default flattenHeaders;