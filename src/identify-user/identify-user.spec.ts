import {identifyUser} from './identify-user';
import Journal from '@byaga/journal';
import {userDataFromRequestContext} from "./user-data-from-request-context";
import {userDataFromAuthToken} from "./user-data-from-auth-token";

jest.mock('@byaga/journal');
jest.mock('./user-data-from-request-context');
jest.mock('./user-data-from-auth-token');
let getSpy: jest.SpyInstance;
beforeEach(() => {
    jest.clearAllMocks();
    getSpy = jest.spyOn(Journal, 'get');
    getSpy.mockReturnValue({
        headers: { req: 'headers'},
        requestContext: { 'req': 'context' }
    });
});

it('returns user data when user is identified from request context', () => {
    const mockUserData = {sub: '123', groups: ['group1', 'group2']};
    (userDataFromRequestContext as jest.Mock).mockReturnValue(mockUserData);
    (userDataFromAuthToken as jest.Mock).mockReturnValue(null);

    const result = identifyUser();

    expect(result).toEqual({data: mockUserData});
    expect(Journal.set).toHaveBeenCalledWith('user', mockUserData, true);
    expect(Journal.annotate).toHaveBeenCalledWith('user.user_id', mockUserData.sub);
    mockUserData.groups.forEach(group => {
        expect(Journal.annotate).toHaveBeenCalledWith(`user.groups.${group}`, true);
    });
});

it('returns user data when user is identified from authorization token', () => {
    const mockUserData = {sub: '123', groups: ['group1', 'group2']};
    (userDataFromRequestContext as jest.Mock).mockReturnValue(null);
    (userDataFromAuthToken as jest.Mock).mockReturnValue(mockUserData);

    const result = identifyUser();

    expect(result).toEqual({data: mockUserData});
    expect(Journal.set).toHaveBeenCalledWith('user', mockUserData, true);
    expect(Journal.annotate).toHaveBeenCalledWith('user.user_id', mockUserData.sub);
    mockUserData.groups.forEach(group => {
        expect(Journal.annotate).toHaveBeenCalledWith(`user.groups.${group}`, true);
    });
});

it('returns error when user is not identified', () => {
    (userDataFromRequestContext as jest.Mock).mockReturnValue(null);
    (userDataFromAuthToken as jest.Mock).mockReturnValue(null);

    const result = identifyUser();

    expect(result).toEqual({error: "No Auth Found"});
    expect(Journal.set).not.toHaveBeenCalled();
    expect(Journal.annotate).not.toHaveBeenCalled();
});