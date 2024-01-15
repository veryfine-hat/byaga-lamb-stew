import {StructuredLog} from '@byaga/journal/lib/StructuredLog';

jest.mock('@byaga/journal');

let configureSpy: jest.SpyInstance;

beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();
    const Journal = (await import('@byaga/journal')).default
    configureSpy = jest.spyOn(Journal, 'configure');
})
it('configures the journal with a custom write function', async () => {
    await import("./initialize-journal");

    expect(configureSpy).toHaveBeenCalledWith({
        write: expect.any(Function)
    });
});

it('custom write function formats the data as a JSON string', async () => {
    await import("./initialize-journal");

    const writeFunction = configureSpy.mock.calls[0][0].write || jest.fn();
    const data: StructuredLog = {level: 'info', message: 'test'};
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation();

    writeFunction(data);

    expect(writeSpy).toHaveBeenCalledWith(JSON.stringify(data).replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '\r\n');
});