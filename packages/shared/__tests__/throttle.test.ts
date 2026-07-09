import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { throttle } from '../src/throttle';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should throttle calls (trailing by default)', async () => {
    const cb = vi.fn();
    const throttled = throttle(cb, 50);

    throttled(1);
    throttled(2);
    throttled(3);

    expect(cb).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(50);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(3);
  });

  it('should support leading call', async () => {
    const cb = vi.fn();
    const throttled = throttle(cb, 50, true, true);

    throttled(1);
    throttled(2);

    await vi.advanceTimersByTimeAsync(50);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenNthCalledWith(1, 1);
    expect(cb).toHaveBeenNthCalledWith(2, 2);
  });

  it('should support trailing=false (no trailing call)', async () => {
    const cb = vi.fn();
    const throttled = throttle(cb, 50, false);

    throttled(1);
    throttled(2);

    await vi.advanceTimersByTimeAsync(50);
    // No trailing call, and leading=false so nothing executes
    expect(cb).not.toHaveBeenCalled();
  });

  it('should support leading&trailing combo, discarding intermediate values', async () => {
    const cb = vi.fn();
    const throttled = throttle(cb, 50, true, true);

    throttled('a');
    throttled('b');
    throttled('c');
    throttled('d');

    await vi.advanceTimersByTimeAsync(50);
    // leading calls with 'a', trailing calls with 'd' (last)
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenNthCalledWith(1, 'a');
    expect(cb).toHaveBeenNthCalledWith(2, 'd');
  });

  it('should support a second throttle cycle', async () => {
    const cb = vi.fn();
    const throttled = throttle(cb, 50);

    throttled(1);
    await vi.advanceTimersByTimeAsync(50);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(1);

    throttled(2);
    throttled(3);
    await vi.advanceTimersByTimeAsync(50);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenNthCalledWith(2, 3);
  });

  it('should not accumulate calls after timer completes', async () => {
    const cb = vi.fn();
    const throttled = throttle(cb, 50);

    throttled(1);
    await vi.advanceTimersByTimeAsync(50);
    expect(cb).toHaveBeenCalledTimes(1);

    // After timer, no stored calls
    await vi.advanceTimersByTimeAsync(50);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
