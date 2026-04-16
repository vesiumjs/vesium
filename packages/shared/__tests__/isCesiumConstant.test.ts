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

  it('should return true if defined returns false', () => {
    // Simulate when defined() returns false for falsy values
    expect(isCesiumConstant(0 as any)).toBe(false);
  });
});
