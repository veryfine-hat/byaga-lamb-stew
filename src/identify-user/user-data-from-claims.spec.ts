import {userDataFromClaims} from './user-data-from-claims';
import Journal from '@byaga/journal';
import {AuthClaims} from "./AuthClaims";

jest.mock('@byaga/journal');

beforeEach(() => {
    jest.clearAllMocks();
});

it('returns user data when sub claim is present', () => {
    const mockClaims: AuthClaims = {sub: '123', email: 'test@example.com', groups: ['group1', 'group2']};
    const mockEventData = {key: 'value'};

    const result = userDataFromClaims(mockClaims, mockEventData);

    expect(result).toEqual({sub: '123', email: 'test@example.com', groups: ['group1', 'group2']});
    expect(Journal.set).toHaveBeenCalledWith('event-user-data', mockEventData, true);
});

it('returns user data with empty groups array when groups claim is not present', () => {
    const mockClaims: AuthClaims = {sub: '123', email: 'test@example.com'};
    const mockEventData = {key: 'value'};

    const result = userDataFromClaims(mockClaims, mockEventData);

    expect(result).toEqual({sub: '123', email: 'test@example.com', groups: []});
    expect(Journal.set).toHaveBeenCalledWith('event-user-data', mockEventData, true);
});

it('returns user data with single element groups array when groups claim is a string', () => {
    const mockClaims: AuthClaims = {sub: '123', email: 'test@example.com', groups: 'group1'};
    const mockEventData = {key: 'value'};

    const result = userDataFromClaims(mockClaims, mockEventData);

    expect(result).toEqual({sub: '123', email: 'test@example.com', groups: ['group1']});
    expect(Journal.set).toHaveBeenCalledWith('event-user-data', mockEventData, true);
});