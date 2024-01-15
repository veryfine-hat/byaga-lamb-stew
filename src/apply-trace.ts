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
        'X-Forwarded-Referrer': Journal.getContextValue('referrer'),
        'X-Forwarded-User-Agent': Journal.getContextValue('userAgent'),
        'Accept-Language': Journal.getContextValue('language'),
        'X-Viewer-Country': Journal.getContextValue('country'),
        'X-Forwarded-For': Journal.getContextValue('forwardedIp'),
        'X-Trace-Id': Journal.getContextValue('traceId'),
        'X-Span-Id': Journal.getContextValue('spanId'),
        'X-Correlation-Id': Journal.getContextValue('correlationId')
    }
});

export default applyTrace;