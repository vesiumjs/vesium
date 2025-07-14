import type { CoordArray } from 'vesium';

/**
 * 三角旗标（使用两个控制点直接创建三角旗标）
 */
export function flagTriangle(coords: CoordArray[]): CoordArray[] {
  const coordlength = coords.length;
  if (coordlength < 2) {
    throw new Error('coords.length must >= 2');
  }
  const [startCoord, endCoord] = coords;
  const coord1: CoordArray = [endCoord[0], (startCoord[1] + endCoord[1]) / 2];
  const coord2: CoordArray = [startCoord[0], (startCoord[1] + endCoord[1]) / 2];
  const coord3: CoordArray = [startCoord[0], endCoord[1]];
  return [startCoord, coord1, coord2, coord3];
}
