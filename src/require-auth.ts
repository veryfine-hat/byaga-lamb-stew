import {identifyUser} from "./identify-user";
import {forbidden} from "./response";

type WrappedFunction = (...args: unknown[]) => unknown;
/**
 * This function is a higher-order function that wraps another function (fn) and adds authentication.
 * It first identifies the user by calling the identifyUser function.
 * If the user is not identified (i.e., the user id is not present), it returns a forbidden response.
 * If the user is identified, it calls the wrapped function (fn) with the original arguments.
 *
 * @param fn - The function to wrap with authentication.
 * @returns The wrapped function that requires authentication.
 */
export function requireAuth(fn: WrappedFunction): WrappedFunction {
    return (...args: unknown[]) => {
        const user = identifyUser();
        const userId = user?.data?.sub;
        if (!userId) return forbidden()

        return fn(...args)
    }
}

export default requireAuth;