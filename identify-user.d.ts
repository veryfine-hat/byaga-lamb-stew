import {IHttpLambdaEvent} from "./enhance";

function identifyUser(event: IHttpLambdaEvent): MethodResult
export function parseJwt(token: string): JwtAuthData

export interface MethodResult {
    status?: string
    data?: any
}
export interface JwtAuthData {
    iat?: number
}