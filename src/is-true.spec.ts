import {isTrue} from './is-true';

it('returns true for string "true"', () => {
    expect(isTrue('true')).toBe(true);
});

it('returns true for boolean true', () => {
    expect(isTrue(true)).toBe(true);
});

it('returns false for string "false"', () => {
    expect(isTrue('false')).toBe(false);
});

it('returns false for boolean false', () => {
    expect(isTrue(false)).toBe(false);
});

it('returns false for undefined', () => {
    expect(isTrue(undefined)).toBe(false);
});

it('returns false for null', () => {
    expect(isTrue(null)).toBe(false);
});

it('returns false for a number', () => {
    expect(isTrue(1)).toBe(false);
});

it('returns false for an object', () => {
    expect(isTrue({})).toBe(false);
});

it('returns false for an array', () => {
    expect(isTrue([])).toBe(false);
});