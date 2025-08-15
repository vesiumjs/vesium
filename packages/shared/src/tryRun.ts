import type { AnyFn } from './types';

/**
 * Safely execute the provided function without throwing errors,
 * essentially a simple wrapper around a `try...catch...` block
 */
export function tryRun<T extends AnyFn>(fn: T): T {
  return ((...args: any[]) => {
    try {
      return fn?.(...args);
    }
    catch (error) {
      console.error(error);
    }
  }) as T;
}
