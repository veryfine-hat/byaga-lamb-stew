import {IHttpLambdaEvent, ILogger} from "./enhance";

export function identifyUser(event: IHttpLambdaEvent, logger: ILogger): MethodResult
export function parseJwt(token: string): JwtAuthData

export interface MethodResult {
    status?: string
    data?: any
}
export interface JwtAuthData {
    iat?: number
}