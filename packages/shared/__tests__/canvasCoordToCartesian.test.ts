import { Cartesian2, Cartesian3 } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { canvasCoordToCartesian } from '../src/canvasCoordToCartesian';

describe('canvasCoordToCartesian', () => {
  function createMockScene(options: {
    pickPosition?: Cartesian3 | undefined;
    pickRay?: { direction: Cartesian3; origin: Cartesian3 };
    globePick?: Cartesian3 | undefined;
    depthTestAgainstTerrain?: boolean;
  } = {}) {
    const {
      pickPosition = new Cartesian3(1, 2, 3),
      pickRay = { direction: new Cartesian3(0, 0, 1), origin: new Cartesian3(0, 0, 0) },
      globePick = new Cartesian3(4, 5, 6),
      depthTestAgainstTerrain = false,
    } = options;

    return {
      pickPosition: vi.fn().mockReturnValue(pickPosition),
      camera: {
        getPickRay: vi.fn().mockReturnValue(pickRay),
      },
      globe: {
        pick: vi.fn().mockReturnValue(globePick),
        depthTestAgainstTerrain,
      },
    } as any;
  }

  describe('pickPosition mode', () => {
    it('should use scene.pickPosition', () => {
      const canvasCoord = new Cartesian2(100, 200);
      const expected = new Cartesian3(1, 2, 3);
      const mockScene = createMockScene({ pickPosition: expected });

      const result = canvasCoordToCartesian(canvasCoord, mockScene, 'pickPosition');

      expect(mockScene.pickPosition).toHaveBeenCalledWith(canvasCoord);
      expect(result).toBe(expected);
    });
  });

  describe('globePick mode', () => {
    it('should use camera.getPickRay and globe.pick', () => {
      const canvasCoord = new Cartesian2(100, 200);
      const expected = new Cartesian3(4, 5, 6);
      const mockScene = createMockScene({ globePick: expected });

      const result = canvasCoordToCartesian(canvasCoord, mockScene, 'globePick');

      expect(mockScene.camera.getPickRay).toHaveBeenCalledWith(canvasCoord);
      expect(result).toBe(expected);
    });

    it('should return undefined if getPickRay returns undefined', () => {
      const canvasCoord = new Cartesian2(100, 200);
      const mockScene = {
        pickPosition: vi.fn(),
        camera: {
          getPickRay: vi.fn().mockReturnValue(undefined),
        },
        globe: {
          pick: vi.fn(),
          depthTestAgainstTerrain: false,
        },
      } as any;

      const result = canvasCoordToCartesian(canvasCoord, mockScene, 'globePick');

      expect(result).toBeUndefined();
    });
  });

  describe('auto mode', () => {
    it('should use pickPosition when depthTestAgainstTerrain is true', () => {
      const canvasCoord = new Cartesian2(100, 200);
      const expected = new Cartesian3(1, 2, 3);
      const mockScene = createMockScene({ pickPosition: expected, depthTestAgainstTerrain: true });

      const result = canvasCoordToCartesian(canvasCoord, mockScene, 'auto');

      expect(mockScene.pickPosition).toHaveBeenCalledWith(canvasCoord);
      expect(mockScene.globe.pick).not.toHaveBeenCalled();
      expect(result).toBe(expected);
    });

    it('should return position2 when position1 is undefined', () => {
      const canvasCoord = new Cartesian2(100, 200);
      const expected = new Cartesian3(4, 5, 6);
      const mockScene = createMockScene({ pickPosition: undefined, globePick: expected });

      const result = canvasCoordToCartesian(canvasCoord, mockScene, 'auto');

      expect(result).toBe(expected);
    });

    it('should use both pickPosition and globePick when depthTestAgainstTerrain is false', () => {
      const canvasCoord = new Cartesian2(100, 200);
      const position1 = new Cartesian3(1, 2, 3);
      const position2 = new Cartesian3(4, 5, 6);
      const mockScene = createMockScene({ pickPosition: position1, globePick: position2 });

      const result = canvasCoordToCartesian(canvasCoord, mockScene, 'auto');

      // Both should be called in auto mode
      expect(mockScene.pickPosition).toHaveBeenCalled();
      expect(mockScene.camera.getPickRay).toHaveBeenCalled();
      expect(mockScene.globe.pick).toHaveBeenCalled();
      // Result depends on height comparison, we just verify it returns one of them
      expect([position1, position2]).toContain(result);
    });
  });
});
