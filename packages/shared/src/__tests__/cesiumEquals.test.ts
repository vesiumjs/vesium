import { Cartesian3, Cartographic } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { cesiumEquals } from '../cesiumEquals';

describe('cesiumEquals', () => {
  it('should return true for identical references', () => {
    const obj = { value: 1 };
    expect(cesiumEquals(obj, obj)).toBe(true);
  });

  it('should return true for equal primitives', () => {
    expect(cesiumEquals(1, 1)).toBe(true);
    expect(cesiumEquals('a', 'a')).toBe(true);
  });

  it('should return false for NaN === NaN', () => {
    expect(cesiumEquals(Number.NaN, Number.NaN)).toBe(false);
  });

  it('should use left.equals if available (returning true)', () => {
    const left = { equals: vi.fn().mockReturnValue(true) };
    const right = { value: 1 };
    expect(cesiumEquals(left, right)).toBe(true);
    expect(left.equals).toHaveBeenCalledWith(right);
  });

  it('should use left.equals if available (returning false)', () => {
    const left = { equals: vi.fn().mockReturnValue(false) };
    const right = { value: 1 };
    expect(cesiumEquals(left, right)).toBe(false);
    expect(left.equals).toHaveBeenCalledWith(right);
  });

  it('should use right.equals if left has no equals method', () => {
    const left = { value: 1 };
    const right = { equals: vi.fn().mockReturnValue(true) };
    expect(cesiumEquals(left, right)).toBe(true);
    expect(right.equals).toHaveBeenCalledWith(left);
  });

  it('should fall through when left.equals returns false and right.equals returns false', () => {
    const left = { equals: vi.fn().mockReturnValue(false) };
    const right = { equals: vi.fn().mockReturnValue(false) };
    expect(cesiumEquals(left, right)).toBe(false);
    expect(left.equals).toHaveBeenCalledWith(right);
    expect(right.equals).toHaveBeenCalledWith(left);
  });

  it('should return false if neither has equals and references differ', () => {
    const left = { value: 1 };
    const right = { value: 1 };
    expect(cesiumEquals(left, right)).toBe(false);
  });

  it('should handle null values', () => {
    expect(cesiumEquals(null, null)).toBe(true);
    expect(cesiumEquals(null, {})).toBe(false);
  });

  it('should handle undefined values', () => {
    expect(cesiumEquals(undefined, undefined)).toBe(true);
    expect(cesiumEquals(undefined, {})).toBe(false);
  });

  it('should return true for equal Cesium Cartesian3 objects', () => {
    const a = new Cartesian3(1, 2, 3);
    const b = new Cartesian3(1, 2, 3);
    expect(cesiumEquals(a, b)).toBe(true);
  });

  it('should return false for different Cesium Cartesian3 objects', () => {
    const a = new Cartesian3(1, 2, 3);
    const b = new Cartesian3(4, 5, 6);
    expect(cesiumEquals(a, b)).toBe(false);
  });

  it('should return true for equal Cesium Cartographic objects', () => {
    const a = Cartographic.fromDegrees(120, 30, 100);
    const b = Cartographic.fromDegrees(120, 30, 100);
    expect(cesiumEquals(a, b)).toBe(true);
  });
});
