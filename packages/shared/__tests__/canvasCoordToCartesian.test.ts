import { Cartesian2, Cartesian3, Ellipsoid } from 'cesium';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { canvasCoordToCartesian } from '../src/canvasCoordToCartesian';

describe('canvasCoordToCartesian', () => {
  const cartesianToCartoSpy = vi.spyOn(Ellipsoid.prototype as any, 'cartesianToCartographic');

  afterEach(() => {
    cartesianToCartoSpy.mockReset();
  });

  function mockHeight(cartesian: Cartesian3): number {
    // Use the z component as a deterministic cartographic height
    return cartesian.z;
  }

  function createMockScene(options: {
    pickPosition?: Cartesian3 | undefined;
    pickRay?: { direction: Cartesian3; origin: Cartesian3 };
    globePick?: Cartesian3 | undefined;
    depthTestAgainstTerrain?: boolean;
  } = {}) {
    const {
      pickPosition,
      pickRay = { direction: new Cartesian3(0, 0, 1), origin: new Cartesian3(0, 0, 0) },
      globePick,
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

    it('should return the higher position when both are defined (position2 higher)', () => {
      const canvasCoord = new Cartesian2(100, 200);
      const position1 = new Cartesian3(1, 2, 3);
      const position2 = new Cartesian3(4, 5, 6);
      const mockScene = createMockScene({ pickPosition: position1, globePick: position2 });
      cartesianToCartoSpy.mockImplementation((c: Cartesian3) => ({ height: mockHeight(c) }) as any);

      const result = canvasCoordToCartesian(canvasCoord, mockScene, 'auto');

      expect(mockScene.pickPosition).toHaveBeenCalled();
      expect(mockScene.camera.getPickRay).toHaveBeenCalled();
      expect(mockScene.globe.pick).toHaveBeenCalled();
      // position2 has the higher height (6 > 3), so it must be returned
      expect(result).toBe(position2);
    });

    it('should return the higher position when both are defined (position1 higher)', () => {
      const canvasCoord = new Cartesian2(100, 200);
      const position1 = new Cartesian3(1, 2, 9);
      const position2 = new Cartesian3(4, 5, 2);
      const mockScene = createMockScene({ pickPosition: position1, globePick: position2 });
      cartesianToCartoSpy.mockImplementation((c: Cartesian3) => ({ height: mockHeight(c) }) as any);

      const result = canvasCoordToCartesian(canvasCoord, mockScene, 'auto');

      // position1 has the higher height (9 > 2), so it must be returned
      expect(result).toBe(position1);
    });

    it('should return position2 when heights are equal', () => {
      const canvasCoord = new Cartesian2(100, 200);
      const position1 = new Cartesian3(1, 2, 5);
      const position2 = new Cartesian3(4, 5, 5);
      const mockScene = createMockScene({ pickPosition: position1, globePick: position2 });
      cartesianToCartoSpy.mockImplementation((c: Cartesian3) => ({ height: mockHeight(c) }) as any);

      const result = canvasCoordToCartesian(canvasCoord, mockScene, 'auto');

      expect(result).toBe(position2);
    });
  });
});
