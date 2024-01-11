import {APIGatewayProxyEvent} from "aws-lambda";
import {deepMerge} from "./deep-merge";
import Journal from "@byaga/journal";

/***
 * Applies the trace information from the Journal to the specified event
 */
export const applyTrace = (
    httpEvent: APIGatewayProxyEvent = {} as unknown as APIGatewayProxyEvent
): APIGatewayProxyEvent => deepMerge(httpEvent, {
    headers: {
        'X-Forwarded-Referrer': Journal.get('referrer'),
        'X-Forwarded-User-Agent': Journal.get('userAgent'),
        'Accept-Language': Journal.get('language'),
        'X-Viewer-Country': Journal.get('country'),
        'X-Forwarded-For': Journal.get('forwardedIp'),
        'X-Trace-Id': Journal.get('traceId'),
        'X-Span-Id': Journal.get('spanId'),
        'X-Correlation-Id': Journal.get('correlationId')
    }
});

export default applyTrace;