import {APIGatewayProxyResult} from "aws-lambda";

/***
 * Applies the specified status Code the response object
 */
export const statusCode = (statusCode: number, rsp?: APIGatewayProxyResult): APIGatewayProxyResult => {
    return {...rsp, statusCode } as unknown as APIGatewayProxyResult;
}

/***
 * Returns a HTTP OK response
 */
export const ok = (rsp?: APIGatewayProxyResult): APIGatewayProxyResult => statusCode(200, rsp);

/***
 * Returns an HTTP Created response
 */
export const created = (rsp?: APIGatewayProxyResult): APIGatewayProxyResult => statusCode(201, rsp);

/***
 * Returns an HTTP OK No Content response
 */
export const okNoContent = (rsp?: APIGatewayProxyResult): APIGatewayProxyResult => statusCode(204, rsp);

/***
 * Returns an HTTP Bad Request response
 */
export const badRequest = (rsp?: APIGatewayProxyResult): APIGatewayProxyResult => statusCode(400, rsp);
export const unauthorized = (rsp?: APIGatewayProxyResult): APIGatewayProxyResult => statusCode(401, rsp);
export const forbidden = (rsp?: APIGatewayProxyResult): APIGatewayProxyResult => statusCode(403, rsp);

/***
 * Returns an HTTP Not Found response
 */
export const notFound = (rsp?: APIGatewayProxyResult): APIGatewayProxyResult => statusCode(404, rsp);

/***
 * Returns an HTTP Server Error response
 */
export const serverError = (rsp?: APIGatewayProxyResult): APIGatewayProxyResult => statusCode(500, rsp);