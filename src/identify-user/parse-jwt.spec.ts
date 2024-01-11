import {parseJwt} from './parse-jwt';

it('returns the payload when given a valid JWT', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const expectedPayload = {"sub": "1234567890", "name": "John Doe", "iat": 1516239022};

    const result = parseJwt(token);

    expect(result).toEqual(expectedPayload);
});

it('throws an error when given an invalid JWT', () => {
    const token = 'invalid.jwt.token';

    expect(() => parseJwt(token)).toThrow();
});

it('returns an empty object when given a JWT without a payload', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.';

    const result = parseJwt(token);

    expect(result).toEqual({});
});