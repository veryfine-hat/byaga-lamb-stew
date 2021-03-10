import {IEventData, IHttpLambdaEvent} from "../enhance";


export default function eventFromLogData(eventTrace: IEventData, IHttpLambdaEvent): IHttpLambdaEvent