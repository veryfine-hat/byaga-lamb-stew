import { LambdaClient} from "@aws-sdk/client-lambda";

export const client = new LambdaClient({apiVersion: '2015-03-31'});

export default client;