import {flattenHeaders} from './flatten-headers';

it('returns a new headers object with all keys in lowercase', () => {
    const headers = {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'custom value'
    };

    const result = flattenHeaders(headers);

    expect(result).toEqual({
        'content-type': 'application/json',
        'x-custom-header': 'custom value'
    });
});

it('returns an empty object when no headers are provided', () => {
    const result = flattenHeaders({});

    expect(result).toEqual({});
});

it('returns an empty object when headers is undefined', () => {
    const result = flattenHeaders(undefined);

    expect(result).toEqual({});
});