import {IHttpLambdaEvent, ILambdaContext, IEventData} from "../enhance";

export default function eventData(event: IHttpLambdaEvent, context: ILambdaContext): IEventData