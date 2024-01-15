import {applyUser} from './apply-user';
import Journal from "@byaga/journal";
import {APIGatewayProxyEvent} from "aws-lambda";

jest.mock("@byaga/journal");
let getSpy: jest.SpyInstance;
beforeEach(() => {
    jest.clearAllMocks();
    getSpy = jest.spyOn(Journal, 'getContextValue');
});

it('merges user data into the request object', () => {
    const request: APIGatewayProxyEvent = {headers: {'Existing-Header': 'Existing value'}} as unknown as APIGatewayProxyEvent
    const userData = {headers: {'User-Data-Header': 'User data value'}};

    getSpy.mockReturnValue(userData);

    const result = applyUser(request);

    expect(result).toEqual({
        headers: {
            'Existing-Header': 'Existing value',
            'User-Data-Header': 'User data value'
        }
    });
});

it('returns user data when request object is not provided', () => {
    const userData = {headers: {'User-Data-Header': 'User data value'}};

    getSpy.mockReturnValue(userData);

    const result = applyUser();

    expect(result).toEqual(userData);
});

it('returns an empty object when user data is not available', () => {
    const request: APIGatewayProxyEvent = {headers: {'Existing-Header': 'Existing value'}}  as unknown as APIGatewayProxyEvent;

    getSpy.mockReturnValue(undefined);

    const result = applyUser(request);

    expect(result).toEqual(request);
});