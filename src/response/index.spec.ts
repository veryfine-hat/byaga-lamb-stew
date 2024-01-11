import { statusCode, ok, created, okNoContent, badRequest, unauthorized, forbidden, notFound, serverError } from './index';
import {APIGatewayProxyResult} from "aws-lambda";

const event: APIGatewayProxyResult = { body: 'OK' } as unknown as APIGatewayProxyResult;
describe('Response status codes', () => {
    it('returns response with status code', () => {
        const response = statusCode(200, event);
        expect(response).toEqual({ body: 'OK', statusCode: 200 });
    });

    it('returns OK response', () => {
        const response = ok(event);
        expect(response).toEqual({ body: 'OK', statusCode: 200 });
    });

    it('returns Created response', () => {
        const response = created(event);
        expect(response).toEqual({ body: 'OK', statusCode: 201 });
    });

    it('returns OK No Content response', () => {
        const response = okNoContent(event);
        expect(response).toEqual({ body: 'OK', statusCode: 204 });
    });

    it('returns Bad Request response', () => {
        const response = badRequest(event);
        expect(response).toEqual({ body: 'OK', statusCode: 400 });
    });

    it('returns Unauthorized response', () => {
        const response = unauthorized(event);
        expect(response).toEqual({ body: 'OK', statusCode: 401 });
    });

    it('returns Forbidden response', () => {
        const response = forbidden(event);
        expect(response).toEqual({ body: 'OK', statusCode: 403 });
    });

    it('returns Not Found response', () => {
        const response = notFound(event);
        expect(response).toEqual({ body: 'OK', statusCode: 404 });
    });

    it('returns Server Error response', () => {
        const response = serverError(event);
        expect(response).toEqual({ body: 'OK', statusCode: 500 });
    });
});