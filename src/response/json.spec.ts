import {json} from './json';

it('adds JSON data to the response body and sets appropriate headers', () => {
    const data = {key: 'value'};
    const response = {statusCode: 200, body: ''};
    const result = json(data, response);

    expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length.toString()
        }
    });
});

it('merges with existing headers in the response', () => {
    const data = {key: 'value'};
    const response = {statusCode: 200, body: '', headers: {'Existing-Header': 'Existing value'}};
    const result = json(data, response);

    expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length.toString(),
            'Existing-Header': 'Existing value'
        }
    });
});

it('overrides existing Content-Type and Content-Length headers in the response', () => {
    const data = {key: 'value'};
    const response = {statusCode: 200, body: '', headers: {'Content-Type': 'text/plain', 'Content-Length': '0'}};
    const result = json(data, response);

    expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length.toString()
        }
    });
});