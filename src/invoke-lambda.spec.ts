import {InvokeCommand} from "@aws-sdk/client-lambda";
import {client} from './client-lambda'
import Journal from '@byaga/journal';
import { invokeLambda } from './invoke-lambda';

jest.mock('@aws-sdk/client-lambda');
jest.mock('./client-lambda')
jest.mock('@byaga/journal');

let stopTimerMock: jest.Mock<void, [], void>;

beforeEach(() => {
    jest.clearAllMocks();
    stopTimerMock = jest.fn()
    jest.spyOn(Journal, 'startTimer').mockReturnValue(stopTimerMock);
});

it('invokes the Lambda function and returns the payload', async () => {
    const functionName = 'my-function';
    const params = {key: 'value'};
    const mockPayload = JSON.stringify({key: 'value'});
    const mockResponse = {StatusCode: 200, Payload: Buffer.from(mockPayload)};

    (client.send as jest.Mock).mockResolvedValue(mockResponse);
    (InvokeCommand as unknown as jest.Mock).mockReturnValue({'test': 'invoke'})
    //exceptionMock.mockImplementation(console.error)
    const {result} = await invokeLambda(functionName, params);

    expect(InvokeCommand).toHaveBeenCalledWith({FunctionName: functionName, InvocationType: 'RequestResponse', Payload: JSON.stringify(params)});
    expect(client.send).toHaveBeenCalledWith({'test': 'invoke'});
    expect(result).toEqual(JSON.parse(mockPayload));
});

it('returns an error object when the Lambda function invocation fails', async () => {
    const functionName = 'my-function';
    const params = {key: 'value'};
    const mockResponse = {StatusCode: 500};

    (client.send as jest.Mock).mockResolvedValue(mockResponse);

    const result = await invokeLambda(functionName, params);

    expect(result).toEqual({error: mockResponse});
});

it('returns an error when the Lambda client throws an error', async () => {
    const functionName = 'my-function';
    const params = {key: 'value'};
    const mockError = new Error('Test error');

    (client.send as jest.Mock).mockRejectedValue(mockError);

    const result = await invokeLambda(functionName, params);

    expect(result).toEqual(expect.objectContaining({error:mockError}));
});