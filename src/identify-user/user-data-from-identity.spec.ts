import {userDataFromIdentity} from './user-data-from-identity';
import Journal from '@byaga/journal';
import {APIGatewayEventIdentity} from "aws-lambda/common/api-gateway";

let setMock: jest.SpyInstance


beforeEach(() => {
    jest.clearAllMocks();

    setMock = jest.spyOn(Journal, 'set');
});

it('returns user data when user property is present in identity', () => {
    const mockIdentity: APIGatewayEventIdentity = {user: '123'} as unknown as APIGatewayEventIdentity;
    const mockEventData = {key: 'value'};

    const result = userDataFromIdentity(mockIdentity, mockEventData);

    expect(result).toEqual({sub: '123', groups: []});
    expect(setMock).toHaveBeenCalledWith('event-user-data', mockEventData, true);
});

it('returns null when user property is not present in identity', () => {
    const mockIdentity: APIGatewayEventIdentity = {} as unknown as APIGatewayEventIdentity;
    const mockEventData = {key: 'value'};

    const result = userDataFromIdentity(mockIdentity, mockEventData);

    expect(result).toBeNull();
});