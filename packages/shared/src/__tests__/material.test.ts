import { Material } from 'cesium';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addMaterialCache, getMaterialCache } from '../material';

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

    it('should return undefined for unknown material type', () => {
      // Verify the return for an unregistered type against the real Cesium material cache
      (Material as any)._materialCache = originalMaterialCache;
      expect(getMaterialCache(`material-unknown-${Date.now()}`)).toBeUndefined();
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
});
