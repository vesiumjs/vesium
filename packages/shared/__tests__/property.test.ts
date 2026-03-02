import { CallbackProperty, ConstantProperty } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { isProperty, toProperty, toPropertyValue } from '../src/property';

vi.mock('cesium', () => {
  class ConstantProperty {
    value: any;
    constructor(value: any) { this.value = value; }
    getValue() { return this.value; }
  }
  class CallbackProperty {
    callback: any;
    isConstant: boolean;
    constructor(callback: any, isConstant: boolean) {
      this.callback = callback;
      this.isConstant = isConstant;
    }

    getValue(time: any) {
      return this.callback(time);
    }
  }
  return { ConstantProperty, CallbackProperty, defined: (v: any) => v !== undefined && v !== null };
});

describe('property utils', () => {
  it('isProperty', () => {
    expect(isProperty(new ConstantProperty(1))).toBe(true);
    expect(isProperty(1)).toBe(false);
  });

  it('toPropertyValue', () => {
    expect(toPropertyValue(1)).toBe(1);
    expect(toPropertyValue(new ConstantProperty(2))).toBe(2);
    expect(toPropertyValue(new CallbackProperty(() => 3, true))).toBe(3);
  });

  it('toProperty', () => {
    const prop1 = toProperty(1);
    expect(prop1).toBeInstanceOf(ConstantProperty);

    const prop2 = toProperty(() => 2);
    expect(prop2).toBeInstanceOf(CallbackProperty);

    const existing = new ConstantProperty(3);
    expect(toProperty(existing)).toBe(existing);
  });
});
