# lamb-stew

A collection of utilities for AWS Lambda functions.  These methods are generally assuimg that the event structure will follow the APIGateway proxy format as this is a reasonable structure that I have found can easily be utilized even for non API Gateway lambdas as it provides a clean mechanism for separating metadata about the event from the actual payload.

## Installation

```bash
npm install @byaga/lamb-stew
```

## Usage

### Enhance
The `enhance` function is a higher-order function that wraps another function (lambda) and adds logging and error handling. It first sets up the logging context, then calls the wrapped function (lambda). If an error occurs while calling the lambda, it logs the error and returns a server error response. It also allows customizing the response by passing an `onResponse` function in the options.

```javascript
import { enhance } from '@byaga/lamb-stew';

const options = {
  service: 'my-service',
  name: 'my-lambda-function',
  onResponse: (response, event) => {
    // Customize the response
    return response;
  }
};

const myLambdaFunction = async (event, context, callback) => {
  // Your lambda function logic here
};

const enhancedFunction = enhance(options)(myLambdaFunction);
```

In this example, `myLambdaFunction` is your AWS Lambda function. The `enhance` function wraps `myLambdaFunction` and adds logging and error handling. If an error occurs while calling `myLambdaFunction`, `enhance` logs the error and returns a server error response. The `onResponse` function in the options allows you to customize the response.

## Options

The `enhance` function accepts an options object with the following properties:

- `service` (required): The name of your service. This is used for logging.
- `name` (optional): The name of your lambda function. This is used for logging. If not provided, 'lambda-handler' is used.
- `onResponse` (optional): A function that allows you to customize the response. It receives the response and the event as arguments.

## License

[MIT](LICENSE)