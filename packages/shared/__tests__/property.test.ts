import { CallbackProperty, ConstantProperty } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import {
  createCesiumAttribute,
  createCesiumProperty,
  createPropertyField,
  isProperty,
  toProperty,
  toPropertyValue,
} from '../src/property';

describe('property', () => {
  describe('isProperty', () => {
    it('should return true for Cesium Property objects', () => {
      const prop = new ConstantProperty(1);
      expect(isProperty(prop)).toBe(true);
    });

    it('should return true for objects with getValue method', () => {
      const obj = { getValue: () => 1 };
      expect(isProperty(obj)).toBe(true);
    });

    it('should return false for plain values', () => {
      expect(isProperty(1)).toBe(false);
      expect(isProperty('hello')).toBe(false);
      expect(isProperty({})).toBe(false);
      // isProperty returns falsy value directly for null/undefined (short-circuit)
      expect(!!isProperty(null)).toBe(false);
      expect(!!isProperty(undefined)).toBe(false);
    });
  });

  describe('toPropertyValue', () => {
    it('should return the value directly for non-property values', () => {
      expect(toPropertyValue(42)).toBe(42);
      expect(toPropertyValue('hello')).toBe('hello');
    });

    it('should call getValue for property objects', () => {
      const mockTime = new Date() as any;
      const prop = { getValue: vi.fn().mockReturnValue('result') };
      const result = toPropertyValue(prop, mockTime);
      expect(result).toBe('result');
      expect(prop.getValue).toHaveBeenCalledWith(mockTime);
    });

    it('should work with ConstantProperty', () => {
      const prop = new ConstantProperty('test');
      expect(toPropertyValue(prop)).toBe('test');
    });

    it('should work with CallbackProperty', () => {
      const prop = new CallbackProperty(() => 'dynamic', false);
      expect(toPropertyValue(prop)).toBe('dynamic');
    });
  });

  describe('toProperty', () => {
    it('should return the property directly if already a Property', () => {
      const prop = new ConstantProperty(1);
      expect(toProperty(prop)).toBe(prop);
    });

    it('should create CallbackProperty for function values', () => {
      const getter = () => 42;
      const result = toProperty(getter);
      expect(result).toBeInstanceOf(CallbackProperty);
    });

    it('should create ConstantProperty for plain values', () => {
      const result = toProperty(42);
      expect(result).toBeInstanceOf(ConstantProperty);
      expect(toPropertyValue(result)).toBe(42);
    });

    it('should create ConstantProperty for undefined values', () => {
      const result = toProperty(undefined);
      expect(result).toBeInstanceOf(ConstantProperty);
    });

    it('should pass isConstant to CallbackProperty', () => {
      const getter = () => 42;
      const result = toProperty(getter, true);
      expect(result).toBeInstanceOf(CallbackProperty);
    });
  });

  describe('createPropertyField', () => {
    it('should create a readable property field', () => {
      const scope: any = {};
      createPropertyField(scope, 'test', 'value', true);
      expect(scope.test).toBeDefined();
      expect(scope._test).toBeDefined();
    });

    it('should create a writable property field', () => {
      const scope: any = { definitionChanged: { raiseEvent: vi.fn() } };
      const initialProp = new ConstantProperty('value');
      createPropertyField(scope, 'test', initialProp, false);
      const newProp = new ConstantProperty('new value');
      scope.test = newProp;
      expect(scope._test).toBe(newProp);
      expect(scope._test.getValue()).toBe('new value');
    });
  });

  describe('createCesiumAttribute', () => {
    it('should create an attribute with getter', () => {
      const scope: any = { definitionChanged: { raiseEvent: vi.fn() } };
      createCesiumAttribute(scope, 'test', 'value');
      expect(scope.test).toBe('value');
    });

    it('should support readonly option', () => {
      const scope: any = { definitionChanged: { raiseEvent: vi.fn() } };
      createCesiumAttribute(scope, 'test', 'value', { readonly: true });
      expect(scope.test).toBe('value');
    });

    it('should support shallowClone option for arrays', () => {
      const scope: any = { definitionChanged: { raiseEvent: vi.fn() } };
      createCesiumAttribute(scope, 'test', [1, 2, 3], { shallowClone: true });
      const result = scope.test;
      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(scope._test);
    });

    it('should support shallowClone option for objects', () => {
      const scope: any = { definitionChanged: { raiseEvent: vi.fn() } };
      createCesiumAttribute(scope, 'test', { a: 1 }, { shallowClone: true });
      const result = scope.test;
      expect(result).toEqual({ a: 1 });
      expect(result).not.toBe(scope._test);
    });

    it('should throw error when setting non-property value with toProperty enabled', () => {
      const scope: any = { definitionChanged: { raiseEvent: vi.fn() } };
      createCesiumAttribute(scope, 'test', new ConstantProperty(1), { toProperty: true });
      expect(() => {
        scope.test = 'invalid';
      }).toThrow('The value of test must be a Cesium.Property object');
    });
  });

  describe('createCesiumProperty', () => {
    it('should create a property with toProperty enabled', () => {
      const scope: any = { definitionChanged: { raiseEvent: vi.fn() } };
      createCesiumProperty(scope, 'test', 'value');
      expect(scope.test).toBeDefined();
    });
  });
});
