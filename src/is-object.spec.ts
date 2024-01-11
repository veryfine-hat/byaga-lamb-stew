import {isObject} from './is-object';

it('returns true for plain objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({key: 'value'})).toBe(true);
});

it('returns false for arrays', () => {
    expect(isObject([])).toBe(false);
    expect(isObject(['item1', 'item2'])).toBe(false);
});

it('returns false for null', () => {
    expect(isObject(null)).toBe(false);
});

it('returns false for undefined', () => {
    expect(isObject(undefined)).toBe(false);
});

it('returns false for primitive types', () => {
    expect(isObject(123)).toBe(false);
    expect(isObject('string')).toBe(false);
    expect(isObject(true)).toBe(false);
});

it('returns false for functions', () => {
    expect(isObject(() => {
    })).toBe(false);
});