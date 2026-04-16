import type { AnyFn } from './types';

/**
 * Safely execute the provided function without throwing errors,
 * essentially a simple wrapper around a `try...catch...` block.
 *
 * Errors are logged with context and intentionally not re-thrown,
 * as this utility is designed for use in callback/event contexts
 * where one failure should not break the entire execution chain.
 */
export function tryRun<T extends AnyFn>(fn: T): T {
  return ((...args: any[]) => {
    try {
      return fn?.(...args);
    }
    catch (error) {
      console.error('[tryRun] Error during execution:', error);
    }
  }) as T;
}
