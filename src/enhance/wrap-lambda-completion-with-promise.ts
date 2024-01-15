import {Callback, Context} from "aws-lambda";

export type LambdaEventCallbackHandler<T, R> = (event: T, context: Context, callback: Callback<R>) => void;
export type LambdaEventContextHandler<T, R> = (event: T, context: Context) => void | Promise<R>;
export type LambdaEventPromiseHandler<T, R> = (event: T) => Promise<R>;
export type LambdaEventHandler<T, R> = LambdaEventCallbackHandler<T, R> | LambdaEventContextHandler<T, R> | LambdaEventPromiseHandler<T, R>;

/**
 * A higher-order function that wraps a lambda function and handles all completion methods.
 * @function wrapLambdaCompletionWithPromise
 * @template T - The type of the event object.
 * @template R - The type of the result object.
 * @param lambda - The lambda function to wrap. This function should take an event object, a context object, and a callback function as parameters, and return a Promise or void.
 * @returns A new function that takes the same parameters as the lambda function and returns a Promise. This function handles all completion methods of the lambda function.
 */
export const wrapLambdaCompletionWithPromise = <T, R>(lambda: LambdaEventHandler<T, R>) => {
    return async (event: T, context: Context): Promise<R> => {
        return new Promise((resolve, reject) => {
            function callback(error?: string | Error | null | undefined, result?: R) {
                if (error) reject(error);
                else resolve(result as R);
            }

            // Call the lambda function with the custom context
            let result: void | Promise<R> = undefined;
            try {
                result = lambda(event, context, callback);
            } catch (error) {
                reject(error);
                return;
            }

            // If the lambda function returns a Promise, handle it
            if (result instanceof Promise) {
                result.then(resolve).catch(reject);
            } else if (result !== undefined) {
                resolve(result);
            }
        });
    };
};