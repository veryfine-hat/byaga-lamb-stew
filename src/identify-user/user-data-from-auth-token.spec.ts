import {userDataFromAuthToken} from './user-data-from-auth-token';
import {parseJwt} from './parse-jwt';
import {userDataFromClaims} from './user-data-from-claims';

jest.mock('./parse-jwt');
jest.mock('./user-data-from-claims');

beforeEach(() => {
    jest.clearAllMocks();
});

it('returns null when authorization header is not present', () => {
    const result = userDataFromAuthToken(undefined);

    expect(result).toBeNull();
    expect(parseJwt).not.toHaveBeenCalled();
    expect(userDataFromClaims).not.toHaveBeenCalled();
});

it('returns null when token is not present in authorization header', () => {
    const result = userDataFromAuthToken('Bearer ');

    expect(result).toBeNull();
    expect(parseJwt).not.toHaveBeenCalled();
    expect(userDataFromClaims).not.toHaveBeenCalled();
});

it('returns user data when token is valid', () => {
    const mockClaims = {sub: '123', aud: 'audience'};
    const mockUserData = {id: '123', name: 'John Doe'};
    (parseJwt as jest.Mock).mockReturnValue(mockClaims);
    (userDataFromClaims as jest.Mock).mockReturnValue(mockUserData);

    const result = userDataFromAuthToken('Bearer token');

    expect(result).toEqual(mockUserData);
    expect(parseJwt).toHaveBeenCalledWith('token');
    expect(userDataFromClaims).toHaveBeenCalledWith(mockClaims, {
        requestContext: {authorizer: {claims: mockClaims}},
        headers: {Authorization: 'Bearer token'}
    });
});