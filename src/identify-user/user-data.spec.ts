import {getUserData, setUserData} from './user-data';
import Journal from '@byaga/journal';
import {JsonWebTokenPayload} from "./JsonWebTokenPayload";

jest.mock('@byaga/journal');

it('stores user data in the Journal', () => {
    const mockUserData = {requestContext: {authorizer: {claims: {} as JsonWebTokenPayload}}};
    const setContextValueSpy = jest.spyOn(Journal, 'setContextValue');

    setUserData(mockUserData);

    expect(setContextValueSpy).toHaveBeenCalledWith('event-user-data', mockUserData, true);
});

it('retrieves user data from the Journal', () => {
    const mockUserData = {requestContext: {authorizer: {claims: {}as JsonWebTokenPayload}}};
    const getContextValueSpy = jest.spyOn(Journal, 'getContextValue').mockReturnValue(mockUserData);

    const result = getUserData();

    expect(result).toEqual(mockUserData);
    expect(getContextValueSpy).toHaveBeenCalledWith('event-user-data');
});

it('returns undefined when no user data is stored in the Journal', () => {
    const getContextValueSpy = jest.spyOn(Journal, 'getContextValue').mockReturnValue(undefined);

    const result = getUserData();

    expect(result).toBeUndefined();
    expect(getContextValueSpy).toHaveBeenCalledWith('event-user-data');
});