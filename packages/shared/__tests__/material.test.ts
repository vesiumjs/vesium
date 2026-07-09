import { Material } from 'cesium';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addMaterialCache, getMaterialCache } from '../src/material';

describe('material', () => {
  let originalMaterialCache: any;

  beforeEach(() => {
    originalMaterialCache = (Material as any)._materialCache;
  });

  afterEach(() => {
    (Material as any)._materialCache = originalMaterialCache;
  });

  describe('getMaterialCache', () => {
    it('should call Material._materialCache.getMaterial with the correct type', () => {
      const getMaterial = vi.fn().mockReturnValue({ type: 'test' });
      (Material as any)._materialCache = { getMaterial };

      const result = getMaterialCache('test');

      expect(getMaterial).toHaveBeenCalledWith('test');
      expect(result).toEqual({ type: 'test' });
    });

    it('should return undefined if material not in cache', () => {
      const getMaterial = vi.fn().mockReturnValue(undefined);
      (Material as any)._materialCache = { getMaterial };

      const result = getMaterialCache('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  describe('addMaterialCache', () => {
    it('should call Material._materialCache.addMaterial with the correct parameters', () => {
      const addMaterial = vi.fn();
      (Material as any)._materialCache = { addMaterial };

      const materialOptions = {
        fabric: {
          type: 'custom',
          uniforms: { color: [1, 0, 0, 1] },
        },
      };

      addMaterialCache('custom', materialOptions);

      expect(addMaterial).toHaveBeenCalledWith('custom', materialOptions);
    });
  });

  it('should throw when _materialCache is undefined', () => {
    (Material as any)._materialCache = undefined;
    expect(() => getMaterialCache('test')).toThrow();
    expect(() => addMaterialCache('test', {} as any)).toThrow();
  });
});
