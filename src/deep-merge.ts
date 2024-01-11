import { isObject } from './is-object';

/**
 * Deep merge two or more objects into the target object.
 *
 * @param {any} target - The target object. This object will be modified and will receive the properties of the source objects.
 * @param {...any[]} sources - The source objects. These objects will be merged into the target object. If more than one source object has the same property, the value from the last source object with that property will be used.
 * @returns {any} The target object, after it has been modified to include the properties of the source objects.
 *
 * @example
 *
 * const target = { a: 1, b: 2 };
 * const source1 = { b: 3, c: 4 };
 * const source2 = { c: 5, d: 6 };
 * const result = deepMerge(target, source1, source2);
 * // result: { a: 1, b: 3, c: 5, d: 6 }
 */
export function deepMerge<T>(target: T, ...sources: Record<string, unknown>[]): T {
  if (target === undefined || target === null) return deepMerge({} as T, ...sources);
  if (!isObject(target) || !sources.length) return target;

  const source = sources.shift();

  if (isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        const dest = target as Record<string, unknown>
        if (!Object.prototype.hasOwnProperty.call(target, key)) {
          dest[key] = {} as (T & Record<string, unknown>)[Extract<keyof NonNullable<T>, string>];
        }

        deepMerge(dest[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

export default deepMerge;