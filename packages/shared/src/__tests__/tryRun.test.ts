import { afterEach, describe, expect, it, vi } from 'vitest';
import { tryRun } from '../tryRun';

describe('tryRun', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the wrapped function result', () => {
    const wrapped = tryRun((a: number, b: number) => a + b);
    expect(wrapped(1, 2)).toBe(3);
  });

  it('should swallow errors and log them', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const wrapped = tryRun(() => {
      throw new Error('boom');
    });
    expect(wrapped()).toBeUndefined();
    expect(spy).toHaveBeenCalled();
  });

  it('should tolerate undefined function target', () => {
    const wrapped = tryRun(undefined as any);
    expect(wrapped()).toBeUndefined();
  });
});
