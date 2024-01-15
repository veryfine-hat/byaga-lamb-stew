import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

export interface EnhanceOptions {
    service: string;
    name?: string;
    onResponse?: (response: APIGatewayProxyResult, event: APIGatewayProxyEvent) => APIGatewayProxyResult;
}