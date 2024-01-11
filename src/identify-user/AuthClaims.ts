export interface AuthClaims {
    groups?: string[] | string,
    'cognito:groups'?: string[] | string,
    sub: string,
    email?: string
}