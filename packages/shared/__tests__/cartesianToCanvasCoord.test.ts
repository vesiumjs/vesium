import { Cartesian2, Cartesian3 } from 'cesium';
import { describe, expect, it, vi } from 'vitest';
import { cartesianToCanvasCoord } from '../src/cartesianToCanvasCoord';

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

  it('should throw when scene.cartesianToCanvasCoordinates is not a function', () => {
    const position = new Cartesian3(1, 2, 3);
    const mockScene = {
      cartesianToCanvasCoordinates: 'not-a-function' as any,
    } as any;

    expect(() => cartesianToCanvasCoord(position, mockScene)).toThrow();
  });

  it('should propagate errors thrown by cartesianToCanvasCoordinates', () => {
    const position = new Cartesian3(1, 2, 3);
    const mockScene = {
      cartesianToCanvasCoordinates: vi.fn().mockImplementation(() => {
        throw new Error('scene error');
      }),
    } as any;

    expect(() => cartesianToCanvasCoord(position, mockScene)).toThrow('scene error');
  });
});
