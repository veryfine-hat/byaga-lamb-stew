import {requireAuth} from './require-auth';
import {identifyUser} from './identify-user';
import {forbidden} from './response';

jest.mock('./identify-user');
jest.mock('./response');

beforeEach(() => {
    jest.clearAllMocks();
});

it('calls the wrapped function when user is identified', () => {
    const mockFn = jest.fn();
    const mockUser = {data: {sub: '123'}};
    (identifyUser as jest.Mock).mockReturnValue(mockUser);

    const wrappedFn = requireAuth(mockFn);
    wrappedFn('arg1', 'arg2');

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
});

it('returns forbidden response when user is not identified', () => {
    const mockFn = jest.fn();
    (identifyUser as jest.Mock).mockReturnValue(null);
    (forbidden as jest.Mock).mockReturnValue('Forbidden');

    const wrappedFn = requireAuth(mockFn);
    const result = wrappedFn('arg1', 'arg2');

    expect(result).toBe('Forbidden');
    expect(mockFn).not.toHaveBeenCalled();
});