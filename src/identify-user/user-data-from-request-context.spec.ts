import {userDataFromRequestContext} from './user-data-from-request-context';
import {userDataFromClaims} from './user-data-from-claims';
import {userDataFromIdentity} from './user-data-from-identity';
import {APIGatewayEventRequestContext} from "aws-lambda";

jest.mock('./user-data-from-claims');
jest.mock('./user-data-from-identity');

beforeEach(() => {
    jest.clearAllMocks();
});

it('returns user data from claims when claims are present in authorizer', () => {
    const mockClaims = {sub: '123', aud: 'audience'};
    const mockUserData = {id: '123', name: 'John Doe'};
    (userDataFromClaims as jest.Mock).mockReturnValue(mockUserData);

    const requestContext: APIGatewayEventRequestContext = {authorizer: {claims: mockClaims}} as unknown as APIGatewayEventRequestContext;

    const result = userDataFromRequestContext(requestContext);

    expect(result).toEqual(mockUserData);
    expect(userDataFromClaims).toHaveBeenCalledWith(mockClaims, {requestContext: {authorizer: {claims: mockClaims}}});
    expect(userDataFromIdentity).not.toHaveBeenCalled();
});

it('returns user data from identity when identity is present in request context and claims are not', () => {
    const mockIdentity = {user: '123'};
    const mockUserData = {id: '123', name: 'John Doe'};
    (userDataFromIdentity as jest.Mock).mockReturnValue(mockUserData);

    const requestContext: APIGatewayEventRequestContext = {identity: mockIdentity} as unknown as APIGatewayEventRequestContext;

    const result = userDataFromRequestContext(requestContext);

    expect(result).toEqual(mockUserData);
    expect(userDataFromIdentity).toHaveBeenCalledWith(mockIdentity, {requestContext: {identity: mockIdentity}});
    expect(userDataFromClaims).not.toHaveBeenCalled();
});

it('returns null when neither claims nor identity are present in request context', () => {
    const requestContext = {} as unknown as APIGatewayEventRequestContext;

    const result = userDataFromRequestContext(requestContext);

    expect(result).toBeNull();
    expect(userDataFromClaims).not.toHaveBeenCalled();
    expect(userDataFromIdentity).not.toHaveBeenCalled();
});