import {v4 as uuid} from 'uuid';
import {flattenHeaders} from "./flatten-headers";
import Journal from "@byaga/journal";
import {getClientIp} from "./request-ip";
import {EventData} from "./types/EventData";
import {isTrue} from "./is-true";
import {
    APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEvent
} from "aws-lambda";
import {APIGatewayEventIdentity, APIGatewayEventRequestContextWithAuthorizer} from "aws-lambda/common/api-gateway";
import {getLambdaContext, getLambdaEvent} from "./enhance/event-details";

/**
 * Retrieves event data from the current request context.
 *
 * This function uses the Journal library to get the current event and context,
 * and extracts various details from them, such as the HTTP method, user agent,
 * IP address, and more. It also generates a new trace ID and span ID for the request.
 *
 * @returns {EventData} An object containing the event data.
 *
 * @example
 *
 * const data = getEventData();
 * console.log(data);
 */
export const getEventData = (): EventData => {
    const event = getLambdaEvent() as APIGatewayProxyEvent;
    const context = getLambdaContext();

    const {requestContext = {} as APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>} = event;
    const {identity = {} as APIGatewayEventIdentity} = requestContext ;
    const headers = flattenHeaders(event.headers);
    Journal.setContextValue('headers', headers, true);

    const details: EventData = {
        path: event.path,
        httpMethod: event.httpMethod ? event.httpMethod.toLowerCase() : undefined,
        referrer: headers['x-forwarded-referrer'] || headers.referrer || headers.referer,
        host: headers.host,
        userAgent: headers["x-forwarded-user-agent"] || headers["user-agent"],
        language: headers["accept-language"],
        cacheControl: headers["cache-control"],
        isDesktop: isTrue(headers["cloudfront-is-desktop-viewer"]),
        isMobile: isTrue(headers["cloudfront-is-mobile-viewer"]),
        isSmartTv: isTrue(headers["cloudfront-is-smarttv-viewer"]),
        isTablet: isTrue(headers["cloudfront-is-tablet-viewer"]),
        deviceType: [
            'desktop',
            'mobile',
            'smarttv',
            'tablet'
        ].find(type => isTrue(headers[`cloudfront-is-${type}-viewer`])) || 'unknown',
        country: headers['x-viewer-country'] || headers["cloudfront-viewer-country"],
        ipAddress: getClientIp(headers['x-forwarded-for']) || identity.sourceIp,
        forwardedIp: headers['x-forwarded-for'] || identity.sourceIp,
        stage: requestContext.stage,
        requestId: context.awsRequestId || requestContext.requestId,
        traceId: headers['x-trace-id'] || uuid(),
        spanId: uuid(),
        parentId: headers['x-span-id'],
        correlationId: headers['x-correlation-id'] || context.awsRequestId || requestContext.requestId,
        requestTime: requestContext.requestTimeEpoch ? new Date(requestContext.requestTimeEpoch).toISOString() : undefined
    };
    Journal.setContextValues(details, true);
    return details;
};

export default getEventData;