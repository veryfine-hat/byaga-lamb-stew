import { deepMerge } from '../deep-merge';
import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Updates the response to include the json data with appropriate headers
 * @param {Object | Array<unknown>} data - some JSON data
 * @param {APIGatewayProxyResult | unknown} rsp
 * @returns {APIGatewayProxyResult}
 */
export const json = (
    data: object | Array<unknown>,
    rsp: APIGatewayProxyResult = {} as unknown as APIGatewayProxyResult
): APIGatewayProxyResult => {
    const stringData = JSON.stringify(data);
    rsp = deepMerge(rsp, {
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': stringData?.length?.toString()
        },
        body: stringData
    })
    return rsp;
}

export default json;