import {eventBody} from './event-body';
import Journal from "@byaga/journal";
import {APIGatewayProxyEvent} from "aws-lambda";

jest.mock("@byaga/journal");


it('returns parsed JSON from event body if data is not present', () => {
    const event: APIGatewayProxyEvent = {body: JSON.stringify({key: 'value'})} as unknown as APIGatewayProxyEvent
    const result = eventBody(event);
    expect(result.data).toEqual(JSON.parse(event.body as string));
});

it('logs an exception and returns the error if event body cannot be parsed', () => {
    const event = {body: 'not valid JSON'} as unknown as APIGatewayProxyEvent;
    const result = eventBody(event);
    expect(Journal.exception).toHaveBeenCalled();
    expect(result).toHaveProperty('error');
});

it('returns an empty object if event body and data are not present', () => {
    const event = {} as unknown as APIGatewayProxyEvent;
    const result = eventBody(event);
    expect(result).toEqual({
        data: undefined,
        error: "No Data Provided"
    });
});