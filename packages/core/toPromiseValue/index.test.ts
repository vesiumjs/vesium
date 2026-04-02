import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { toPromiseValue } from '../toPromiseValue';

describe('toPromiseValue', () => {
  it('should handle plain values', async () => {
    const result = await toPromiseValue(123);
    expect(result).toBe(123);
  });

  it('should handle refs', async () => {
    const val = ref('hello');
    const result = await toPromiseValue(val);
    expect(result).toBe('hello');
  });

  it('should handle sync functions', async () => {
    const result = await toPromiseValue(() => 'world');
    expect(result).toBe('world');
  });

  it('should handle async functions', async () => {
    const result = await toPromiseValue(async () => {
      return new Promise(resolve => setTimeout(resolve, 10, 'async'));
    });
    expect(result).toBe('async');
  });

  it('should handle promise refs', async () => {
    const p = Promise.resolve('resolved');
    const result = await toPromiseValue(p);
    expect(result).toBe('resolved');
  });

  it('should unwrap to raw value by default', async () => {
    const obj = { a: 1 };
    const r = ref(obj);
    const result = await toPromiseValue(r);
    expect(result).toBe(obj);
    expect(result).not.toHaveProperty('__v_isRef');
  });
});
