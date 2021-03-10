const tryParseJson = require("./try-parse-json");

it('should return an error if a json string is not passed in', () => {
    expect(tryParseJson()).toEqual({
        error: "No Data Provided"
    });
});

it('should return an error if the input string is not valid json', () => {
    expect(tryParseJson("{{}")).toEqual(expect.objectContaining({
        error: expect.any(SyntaxError)
    }));
});

it('should return the parsed json input string', () => {
    expect(tryParseJson('{"some":"parsable","json":{"data":"here"}}')).toEqual({
        error: null,
        data: {
            some: 'parsable',
            json: {
                data: 'here'
            }
        }
    });
});
