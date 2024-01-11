import flattenHeaders from '../flatten-headers';
import Journal from '@byaga/journal';
import {deepMerge} from '../deep-merge';
import { CorsOptions } from '../types/CorsOptions'
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {isTrue} from "../is-true";

export const corsHeaders: string[] = ['X-Forwarded-Referrer', 'Referrer', 'Referer', 'Host', "X-Forwarded-User-Agent", "User-Agent", "Accept-Language", "Cache-Control",
                               'X-Viewer-Country', 'X-Forwarded-For', 'X-Span-Id', 'X-Correlation-Id', 'Content-Type', 'Content-Length', 'Authorization'];
export const corsMethods: string[] = ["GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"];
export const corsExposeHeaders: string[] = ['Date'];
export const corsAllowCredentials: boolean = true;

/**
 * Adds cors headers to the response
 */
export const cors = (
    rsp: APIGatewayProxyResult = {} as unknown as APIGatewayProxyResult,
    options: CorsOptions = {}
): APIGatewayProxyResult => {
    const event: APIGatewayProxyEvent = Journal.get('event');

    const origin: string | string[] = options.origin || "*";
    const methods: string[] = options.methods || corsMethods;
    const allowHeaders: string[] = options.headers || corsHeaders;
    const exposeHeaders: string[] = options.exposeHeaders ?? corsExposeHeaders;

    const headers = flattenHeaders(event.headers);
    const allowedOrigins: string[] = Array.isArray(origin) ? origin : [origin];
    const allowAnyOrigin: boolean = allowedOrigins.includes("*");
    const referer: string | undefined = headers["x-forwarded-referrer"] || headers["referer"] || headers["referrer"];
    const refererDomain: string | undefined = referer?.substr(0, referer?.indexOf("/", 10));
    let allowOrigin: string | undefined;
    if (allowAnyOrigin || (refererDomain && origin.includes(refererDomain))) {
        allowOrigin = refererDomain;
    } else {
        allowOrigin = Array.isArray(origin) ? origin[0] : origin;
    }
    return deepMerge(rsp, {
        headers: {
            "Access-Control-Allow-Origin": allowOrigin,
            "Access-Control-Allow-Methods": methods.join(","),
            "Access-Control-Allow-Headers": allowHeaders.join(","),
            "Access-Control-Max-Age": options.maxAge || 86400,
            "Access-Control-Expose-Headers": exposeHeaders.join(","),
            "Access-Control-Allow-Credentials": isTrue(options.allowCredentials || corsAllowCredentials).toString(),
            "Vary": allowAnyOrigin || allowedOrigins.length > 1 ? "Origin" : undefined
        }
    });
};

export default cors;