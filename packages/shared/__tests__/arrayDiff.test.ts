import { describe, expect, it } from 'vitest';
import { arrayDiff } from '../src/arrayDiff';

describe('arrayDiff', () => {
  it('should return added items when new items are in list but not in oldList', () => {
    const result = arrayDiff([1, 2, 3], [1, 2]);
    expect(result.added).toEqual([3]);
    expect(result.removed).toEqual([]);
  });

  it('should return removed items when items are in oldList but not in list', () => {
    const result = arrayDiff([1, 2], [1, 2, 3]);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([3]);
  });

  it('should return both added and removed items', () => {
    const result = arrayDiff([1, 2, 4], [1, 2, 3]);
    expect(result.added).toEqual([4]);
    expect(result.removed).toEqual([3]);
  });

  it('should return empty arrays when lists are equal', () => {
    const result = arrayDiff([1, 2, 3], [1, 2, 3]);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
  });

  it('should handle undefined oldList', () => {
    const result = arrayDiff([1, 2, 3], undefined);
    expect(result.added).toEqual([1, 2, 3]);
    expect(result.removed).toEqual([]);
  });

  it('should handle undefined list (new list)', () => {
    const result = arrayDiff(undefined, [1, 2, 3]);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([1, 2, 3]);
  });

  it('should handle both undefined', () => {
    const result = arrayDiff(undefined, undefined);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
  });

  it('should handle empty list', () => {
    const result = arrayDiff([], [1, 2, 3]);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([1, 2, 3]);
  });

  it('should handle both empty lists', () => {
    const result = arrayDiff([], []);
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
  });

  it('should work with objects (reference comparison)', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    const result = arrayDiff([obj1, obj2], [obj1, obj3]);
    expect(result.added).toEqual([obj2]);
    expect(result.removed).toEqual([obj3]);
  });

  it('should work with strings', () => {
    const result = arrayDiff(['a', 'b', 'c'], ['a', 'b']);
    expect(result.added).toEqual(['c']);
    expect(result.removed).toEqual([]);
  });

  it('should preserve duplicate added items when list has duplicates (filter, not Set on input)', () => {
    const result = arrayDiff([1, 1, 2, 2], [1]);
    // Set dedup in oldListSet, but list.filter preserves duplicates
    expect(result.added).toEqual([2, 2]);
    expect(result.removed).toEqual([]);
  });

  it('should preserve duplicate removed items when oldList has duplicates', () => {
    const result = arrayDiff([1], [1, 1, 2, 2]);
    // Set dedup in newListSet, but oldList.filter preserves duplicates
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([2, 2]);
  });
});
