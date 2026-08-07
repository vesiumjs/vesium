import { describe, expect, it } from 'vitest';
import {
  assertError,
  isArray,
  isBase64,
  isBoolean,
  isDef,
  isElement,
  isFunction,
  isNumber,
  isObject,
  isPromise,
  isString,
  isWindow,
} from '../src/is';

describe('is.ts', () => {
  describe('isDef', () => {
    it('should return true for defined values', () => {
      expect(isDef(0)).toBe(true);
      expect(isDef('')).toBe(true);
      expect(isDef(false)).toBe(true);
      expect(isDef(null)).toBe(true);
      expect(isDef({})).toBe(true);
      expect(isDef([])).toBe(true);
      expect(isDef(undefined)).toBe(false);
      expect(isDef()).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for boolean values', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-boolean values', () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean('')).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean({})).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction(0)).toBe(false);
      expect(isFunction('')).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(1)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(Number.NaN)).toBe(true);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('1')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(0)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(1)).toBe(false);
      expect(isObject('')).toBe(false);
      expect(isObject(() => {})).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false);
    });
  });

  describe('isWindow', () => {
    it('should return true for window in jsdom', () => {
      expect(isWindow(window)).toBe(true);
    });

    it('should return false for non-window values', () => {
      expect(isWindow({})).toBe(false);
      expect(isWindow(document)).toBe(false);
      expect(isWindow(null)).toBe(false);
      expect(isWindow(undefined)).toBe(false);
    });
  });

  describe('isPromise', () => {
    it('should return true for promises', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(new Promise(resolve => setTimeout(resolve, 0)))).toBe(true);
      // Use void to suppress unhandled rejection warning
      const rejected = Promise.reject(new Error('test'));
      void rejected.catch(() => {});
      expect(isPromise(rejected)).toBe(true);
    });

    it('should return false for non-promises', () => {
      expect(isPromise(0)).toBe(false);
      expect(isPromise('')).toBe(false);
      expect(isPromise(null)).toBe(false);
      expect(isPromise(undefined)).toBe(false);
      expect(isPromise({})).toBe(false);
      expect(isPromise({ then: 1 })).toBe(false);
    });

    it('should detect thenable objects', () => {
      const thenable = { then: () => {} };
      expect(isPromise(thenable)).toBe(true);
    });
  });

  describe('isElement', () => {
    it('should return true for DOM elements', () => {
      const div = document.createElement('div');
      expect(isElement(div)).toBe(true);
    });

    it('should return false for non-elements', () => {
      expect(isElement(null)).toBe(false);
      expect(isElement(undefined)).toBe(false);
      expect(isElement({})).toBe(false);
      expect(isElement(document)).toBe(false);
    });

    it('should return false for text nodes', () => {
      const text = document.createTextNode('hello');
      expect(isElement(text)).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray('')).toBe(false);
    });
  });

  describe('isBase64', () => {
    it('should return true for valid base64 data URIs', () => {
      expect(isBase64('data:image/png;base64,abc123')).toBe(true);
      expect(isBase64('data:text/plain;base64,hello')).toBe(true);
      expect(isBase64('data:image/gif,hello')).toBe(true);
    });

    it('should return false for non-base64 strings', () => {
      expect(isBase64('hello')).toBe(false);
      expect(isBase64('')).toBe(false);
      expect(isBase64('image/png')).toBe(false);
    });
  });

  describe('assertError', () => {
    it('should throw error when condition is true and error is a string', () => {
      expect(() => assertError(true, 'error message')).toThrow('error message');
    });

    it('should throw error when condition is true and error is not a string', () => {
      expect(() => assertError(true, new Error('custom error'))).toThrow('Error: custom error');
      expect(() => assertError(true, 123)).toThrow('123');
    });

    it('should not throw when condition is false', () => {
      expect(() => assertError(false, 'error message')).not.toThrow();
    });
  });
});
