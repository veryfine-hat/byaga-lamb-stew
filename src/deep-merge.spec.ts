import {deepMerge} from './deep-merge';


it('merges properties from source objects into target object', () => {
    const target = {a: 1, b: 2};
    const source1 = {b: 3, c: 4};
    const source2 = {c: 5, d: 6};
    const result = deepMerge(target, source1, source2);
    expect(result).toEqual({a: 1, b: 3, c: 5, d: 6});
});

it('does not modify source objects', () => {
    const target = {a: 1, b: 2};
    const source1 = {b: 3, c: 4};
    const source2 = {c: 5, d: 6};
    deepMerge(target, source1, source2);
    expect(source1).toEqual({b: 3, c: 4});
    expect(source2).toEqual({c: 5, d: 6});
});

it('returns target object when no source objects are provided', () => {
    const target = {a: 1, b: 2};
    const result = deepMerge(target);
    expect(result).toBe(target);
});

it('returns source object when target is null or undefined', () => {
    const source = {a: 1, b: 2};
    expect(deepMerge(null, source)).toEqual(source);
    expect(deepMerge(undefined, source)).toEqual(source);
});

it('merges nested properties from source objects into target object', () => {
    const target = {a: 1, b: {c: 2, d: 3}};
    const source = {b: {d: 4, e: 5}, f: 6};
    const result = deepMerge(target, source);
    expect(result).toEqual({a: 1, b: {c: 2, d: 4, e: 5}, f: 6});
});