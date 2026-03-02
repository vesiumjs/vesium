import { describe, expect, it, vi } from 'vitest';
import { cesiumEquals } from '../src/cesiumEquals';

describe('cesiumEquals', () => {
  it('should return true for identical objects', () => {
    const obj = {};
    expect(cesiumEquals(obj, obj)).toBe(true);
  });

  it('should use equals method if available', () => {
    const left = { equals: vi.fn(() => true) };
    const right = {};
    expect(cesiumEquals(left, right)).toBe(true);
    expect(left.equals).toHaveBeenCalledWith(right);
  });

  it('should handle falsy values', () => {
    expect(cesiumEquals(null, undefined)).toBe(false);
    expect(cesiumEquals(undefined, undefined)).toBe(true);
  });
});
