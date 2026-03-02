import { describe, expect, it, vi } from 'vitest';
import { canvasCoordToCartesian } from '../src/canvasCoordToCartesian';

vi.mock('cesium', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    Ellipsoid: {
      WGS84: {
        cartesianToCartographic: vi.fn(() => ({ height: 10 })),
      },
    },
  };
});

describe('canvasCoordToCartesian', () => {
  const mockScene = {
    pickPosition: vi.fn(() => ({ id: 'pick' })),
    camera: {
      getPickRay: vi.fn(() => ({})),
    },
    globe: {
      pick: vi.fn(() => ({ id: 'globe' })),
      depthTestAgainstTerrain: false,
    },
  } as any;

  it('should use pickPosition in pickPosition mode', () => {
    const result = canvasCoordToCartesian({} as any, mockScene, 'pickPosition');
    expect(mockScene.pickPosition).toHaveBeenCalled();
    expect(result).toEqual({ id: 'pick' });
  });

  it('should use globe.pick in globePick mode', () => {
    const result = canvasCoordToCartesian({} as any, mockScene, 'globePick');
    expect(mockScene.globe.pick).toHaveBeenCalled();
    expect(result).toEqual({ id: 'globe' });
  });
});
