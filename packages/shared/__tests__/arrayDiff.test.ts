import { describe, expect, it } from 'vitest';
import { arrayDiff } from '../src/arrayDiff';

describe('arrayDiff', () => {
  it('should return added and removed items', () => {
    const oldList = [1, 2, 3];
    const newList = [2, 3, 4];
    const result = arrayDiff(newList, oldList);
    expect(result.added).toEqual([4]);
    expect(result.removed).toEqual([1]);
  });

  it('should handle undefined oldList', () => {
    const newList = [1, 2];
    const result = arrayDiff(newList, undefined);
    expect(result.added).toEqual([1, 2]);
    expect(result.removed).toEqual([]);
  });

  it('should return empty when lists are identical', () => {
    const list = [1, 2];
    const result = arrayDiff(list, list);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
  });
});
