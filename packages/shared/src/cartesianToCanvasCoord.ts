import type { Cartesian2, Cartesian3, Scene } from 'cesium';

/**
 * Convert Cartesian coordinates to canvas coordinates
 *
 * @param position Cartesian coordinates
 * @param scene Cesium.Scene instance
 */
export function cartesianToCanvasCoord(position: Cartesian3, scene: Scene): Cartesian2 | undefined {
  return scene.cartesianToCanvasCoordinates(position);
}
