import { describe, expect, it } from 'vitest';
import { assertError, isBase64, isBoolean, isDef, isElement, isFunction, isNumber, isObject, isPromise, isString } from '../src/is';

describe('type checkers', () => {
  it('isDef', () => {
    expect(isDef(0)).toBe(true);
    expect(isDef(undefined)).toBe(false);
  });

  it('isBoolean', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(0)).toBe(false);
  });

  it('isFunction', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction({})).toBe(false);
  });

  it('isNumber', () => {
    expect(isNumber(1)).toBe(true);
    expect(isNumber('1')).toBe(false);
  });

  it('isString', () => {
    expect(isString('')).toBe(true);
    expect(isString(1)).toBe(false);
  });

  it('isObject', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
  });

  it('isPromise', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise({ then: () => {} })).toBe(true);
    expect(isPromise({})).toBe(false);
  });

  it('isElement', () => {
    const el = document.createElement('div');
    expect(isElement(el)).toBe(true);
    expect(isElement({})).toBe(false);
  });

  it('isBase64', () => {
    expect(isBase64('data:image/png;base64,abc')).toBe(true);
    expect(isBase64('abc')).toBe(false);
  });

  it('assertError', () => {
    expect(() => assertError(true, 'fail')).toThrow('fail');
    expect(() => assertError(false, 'fail')).not.toThrow();
  });
});
