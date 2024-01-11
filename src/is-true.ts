/**
 * Checks if a value is true.
 *
 * @param {string | boolean | unknown} value - The value to check.
 * @returns {boolean} `true` if the value is 'true', `false` otherwise.
 */
export const isTrue = (value: string | boolean | unknown): boolean => value === 'true' || value === true;

export default isTrue;