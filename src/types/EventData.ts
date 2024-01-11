export interface EventData {
    path?: string;
    httpMethod?: string;
    referrer?: string;
    host?: string;
    userAgent?: string;
    language?: string;
    cacheControl?: string;
    isDesktop?: boolean;
    isMobile?: boolean;
    isSmartTv?: boolean;
    isTablet?: boolean;
    deviceType?: string;
    country?: string;
    ipAddress?: string;
    forwardedIp?: string;
    stage?: string;
    requestId?: string;
    traceId?: string;
    spanId: string;
    parentId?: string;
    correlationId?: string;
    requestTime?: string;
}