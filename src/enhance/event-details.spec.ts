import {getLambdaContext, getLambdaEvent, setLambdaEventContext} from './event-details';
import Journal from '@byaga/journal';
import {APIGatewayProxyEvent, Context} from 'aws-lambda';

jest.mock('@byaga/journal');

const event: APIGatewayProxyEvent = {} as APIGatewayProxyEvent;
const context: Context = {} as Context;

beforeEach(() => {
    jest.clearAllMocks();
});

it('stores event and context in the Journal', () => {
    const setContextValueSpy = jest.spyOn(Journal, 'setContextValue');

    setLambdaEventContext(event, context);

    expect(setContextValueSpy).toHaveBeenCalledWith('event-context', event, true);
    expect(setContextValueSpy).toHaveBeenCalledWith('lambda-context', context, true);
});

it('retrieves event from the Journal', () => {
    const getContextValueSpy = jest.spyOn(Journal, 'getContextValue').mockReturnValue(event);

    const result = getLambdaEvent();

    expect(result).toEqual(event);
    expect(getContextValueSpy).toHaveBeenCalledWith('event-context');
});

it('retrieves context from the Journal', () => {
    const getContextValueSpy = jest.spyOn(Journal, 'getContextValue').mockReturnValue(context);

    const result = getLambdaContext();

    expect(result).toEqual(context);
    expect(getContextValueSpy).toHaveBeenCalledWith('lambda-context');
});

it('returns undefined when no event is stored in the Journal', () => {
    const getContextValueSpy = jest.spyOn(Journal, 'getContextValue').mockReturnValue(undefined);

    const result = getLambdaEvent();

    expect(result).toBeUndefined();
    expect(getContextValueSpy).toHaveBeenCalledWith('event-context');
});

it('returns undefined when no context is stored in the Journal', () => {
    const getContextValueSpy = jest.spyOn(Journal, 'getContextValue').mockReturnValue(undefined);

    const result = getLambdaContext();

    expect(result).toBeUndefined();
    expect(getContextValueSpy).toHaveBeenCalledWith('lambda-context');
});