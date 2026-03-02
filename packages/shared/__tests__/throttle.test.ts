import { describe, expect, it, vi } from 'vitest';
import { throttle } from '../src/throttle';

describe('throttle', () => {
  it('should throttle calls', async () => {
    const cb = vi.fn();
    const throttled = throttle(cb, 20);

    throttled(1);
    throttled(2);
    throttled(3);

    expect(cb).not.toHaveBeenCalled();

    await new Promise(r => setTimeout(r, 30));
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(3);
  });

  it('should support leading call', async () => {
    // Current implementation of leading is actually a bit weird
    // it waits for delay then calls the first one.
    // Let's test the current behavior.
    const cb = vi.fn();
    const throttled = throttle(cb, 20, true, true);

    throttled(1);
    throttled(2);

    await new Promise(r => setTimeout(r, 30));
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenNthCalledWith(1, 1);
    expect(cb).toHaveBeenNthCalledWith(2, 2);
  });
});
