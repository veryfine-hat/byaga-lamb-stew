import Journal from "../journal/Journal";

export default function enhance(options: IEnhanceOptions, lambda: (event: IHttpLambdaEvent, context: IEnhancedContext) => IHttpLambdaResponse): (event: IHttpLambdaEvent, context: ILambdaContext) => IHttpLambdaResponse

export interface IEnhanceOptions {
    logger: Journal,
    onResponse: (rsp: IHttpLambdaResponse) => IHttpLambdaResponse
}

export interface IHttpLambdaEvent {
    path?: string
    httpMethod?: string
    headers?: IHttpLambdaHeaders
    identity?: IHttpLambdaIdentity
    requestContext?: IHttpLambdaRequestContext
}

export interface IHttpLambdaHeaders {
    'x-forwarded-referrer'?: string
    referrer?: string
    referer?: string
    host?: string
    "x-forwarded-user-agent"?: string
    "user-agent"?: string
    "accept-language"?: string
    "cache-control"?: string
    "cloudfront-is-desktop-viewer"?: string
    "cloudfront-is-mobile-viewer"?: string
    "cloudfront-is-smarttv-viewer"?: string
    "cloudfront-is-tablet-viewer"?: string
    'x-viewer-country'?: string
    "cloudfront-viewer-country"?: string
    'x-forwarded-for'?: string
    'x-span-id'?: string
    'x-correlation-id'?: string
}

export interface IHttpLambdaIdentity {
    sourceIp?: string
}

export interface IHttpLambdaRequestContext {
    stage?: string
    requestId?: string
    requestTimeEpoch?: string
}

export interface ILambdaContext {
    callbackWaitsForEmptyEventLoop: Boolean,
    succeed: (any) => void,
    fail: (any) => void,
    done: (any) => void,
    functionVersion: String,
    functionName: String,
    memoryLimitInMB: String,
    logGroupName: String,
    logStreamName: String,
    invokedFunctionArn: String,
    awsRequestId: String,
    getRemainingTimeInMillis: () => Number,
}

export interface IEnhancedContext extends ILambdaContext {
    logger: ILogger,
    details: IEventData
}

export interface IHttpLambdaResponse {
    statusCode: number,
    body: any
}

export interface IEventData {
    country?: string
    ipAddress?: string
    userAgent?: string
    language?: string
    deviceType?: 'desktop' | 'mobile' | 'smarttv' | 'tablet'
    isSmartTv?: boolean
    isDesktop?: boolean
    isTablet?: boolean
    isMobile?: boolean
    httpMethod?: string
    cacheControl?: string
    parentId?: string
    spanId?: string
    requestTime?: string
    path?: string
    referrer?: string
    stage?: string
    requestId?: string
    host?: string
    forwardedIp?: string
    correlationId?: string
}

export interface ILogger {
    
}