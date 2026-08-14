import { Cartesian2, Cartesian3 } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { cartesianToCanvasCoord } from '../cartesianToCanvasCoord';

describe('cartesianToCanvasCoord', () => {
  it('should call scene.cartesianToCanvasCoordinates with the correct position', () => {
    const position = new Cartesian3(1, 2, 3);
    const expectedCanvasCoord = new Cartesian2(100, 200);

    const mockScene = {
      cartesianToCanvasCoordinates: vi.fn().mockReturnValue(expectedCanvasCoord),
    } as any;

    const result = cartesianToCanvasCoord(position, mockScene);

    expect(mockScene.cartesianToCanvasCoordinates).toHaveBeenCalledWith(position);
    expect(result).toBe(expectedCanvasCoord);
  });

  it('should return undefined if scene returns undefined', () => {
    const position = new Cartesian3(1, 2, 3);

    const mockScene = {
      cartesianToCanvasCoordinates: vi.fn().mockReturnValue(undefined),
    } as any;

    const result = cartesianToCanvasCoord(position, mockScene);

    expect(result).toBeUndefined();
  });
});
