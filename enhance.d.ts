import Journal from "../journal/Journal";

export default function enhance(options: IEnhanceOptions, lambda: (event: IHttpLambdaEvent, context: IEnhancedContext) => IHttpLambdaResponse): (event: IHttpLambdaEvent, context: ILambdaContext) => Promise<IHttpLambdaResponse>

export interface IEnhanceOptions {
    logger: Journal,
    onResponse: (rsp: IHttpLambdaResponse) => IHttpLambdaResponse,
    enableCors: boolean | ICorsOptions
}

export interface ICorsOptions {
    origin?: string
    allowCredentials?: boolean
    methods?: string[],
    headers?: string[],
    maxAge?: number,
}

export interface IHttpLambdaEvent {
    path?: string
    httpMethod?: string
    headers?: IHttpLambdaHeaders
    identity?: IHttpLambdaIdentity
    requestContext?: IHttpLambdaRequestContext
}

export interface IHttpLambdaHeaders {
    'X-Forwarded-Referrer'?: string
    Referrer?: string
    Referer?: string
    Host?: string
    "X-Forwarded-User-Agent"?: string
    "User-Agent"?: string
    "Accept-Language"?: string
    "Cache-Control"?: string
    "Cloudfront-Is-Desktop-Viewer"?: string
    "Cloudfront-Is-Mobile-Viewer"?: string
    "Cloudfront-Is-Smarttv-Viewer"?: string
    "Cloudfront-Is-Tablet-Viewer"?: string
    'X-Viewer-Country'?: string
    "Cloudfront-Viewer-Country"?: string
    'X-Forwarded-For'?: string
    'X-Span-Id'?: string
    'X-Correlation-Id'?: string,
    [p: string]: string
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
    headers?: IHttpLambdaHeaders,
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