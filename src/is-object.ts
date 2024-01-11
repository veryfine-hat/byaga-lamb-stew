/**
 * Checks if a value is an object.
 * @param item - The value to check.
 * @returns `true` if the value is an object, `false` otherwise.
 */
export const isObject = (item: unknown): boolean => {
  return !!(item && typeof item === 'object' && !Array.isArray(item))
}

export default isObject;