import { ConstantProperty } from 'cesium';
import { describe, expect, it } from 'vitest';
import { isCesiumConstant } from '../src/isCesiumConstant';

describe('isCesiumConstant', () => {
  it('should return true for undefined', () => {
    expect(isCesiumConstant(undefined as any)).toBe(true);
  });

  it('should return true for null', () => {
    expect(isCesiumConstant(null as any)).toBe(true);
  });

  it('should return true for constant property', () => {
    const constantProperty = { isConstant: true };
    expect(isCesiumConstant(constantProperty)).toBe(true);
  });

  it('should return false for non-constant property', () => {
    const nonConstantProperty = { isConstant: false };
    expect(isCesiumConstant(nonConstantProperty)).toBe(false);
  });

  it('should short-circuit to false for 0 (falsy non-null/undefined)', () => {
    // defined(0) returns true, but 0 is falsy, so !defined(0) is false
    // value.isConstant is accessed on 0 (a Number) → undefined → !!undefined → false
    expect(isCesiumConstant(0 as any)).toBe(false);
  });

  it('should return false for empty object without isConstant', () => {
    expect(isCesiumConstant({})).toBe(false);
  });

  it('should return true for real Cesium ConstantProperty', () => {
    expect(isCesiumConstant(new ConstantProperty(1))).toBe(true);
  });

  it('should return false for empty string (falsy), which passes defined()', () => {
    expect(isCesiumConstant('' as any)).toBe(false);
  });

  it('should return false for boolean false (falsy)', () => {
    expect(isCesiumConstant(false as any)).toBe(false);
  });
});
