import type { AnyFn } from './types';

const toString = Object.prototype.toString;
// eslint-disable-next-line regexp/no-unused-capturing-group, regexp/no-super-linear-backtracking
const BASE64_RE = /^\s*data:([a-z]+\/[\d+.a-z-]+(;[a-z]+=[\da-z-]+)?)?(;base64)?,([\s\w!$%&'()*+,./:;=?@~-]*?)\s*$/i;

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean';
}

export function isFunction<T extends AnyFn>(val: unknown): val is T {
  return typeof val === 'function';
}

export function isNumber(val: unknown): val is number {
  return typeof val === 'number';
}

export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

export function isObject(val: unknown): val is object {
  return toString.call(val) === '[object Object]';
}

export function isWindow(val: unknown): val is Window {
  return typeof window !== 'undefined' && toString.call(val) === '[object Window]';
}

export function isPromise<T extends Promise<unknown>>(val: unknown): val is T {
  return !!val && (typeof val === 'object' || typeof val === 'function') && typeof (val as Record<string, unknown>).then === 'function';
}

export function isElement<T extends Element>(val: unknown): val is T {
  return !!(val && (val as Element).nodeName && (val as Element).nodeType === 1);
}

export const isArray = Array.isArray;

export function isBase64(val: string): boolean {
  return BASE64_RE.test(val);
}

export function assertError(condition: boolean, error: unknown) {
  if (condition) {
    throw new Error(typeof error === 'string' ? error : String(error));
  }
}
