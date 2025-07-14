import type { CoordArray } from 'vesium';

/**
 * 直角旗标（使用两个控制点直接创建直角旗标）
 */
export function flagRect(coords: CoordArray[]): CoordArray[] {
  if (coords.length < 2) {
    throw new Error('coords.length must >= 2');
  }
  const [startCoord, endCoord] = coords;
  const coord1 = [endCoord[0], startCoord[1]];
  const coord2 = [endCoord[0], (startCoord[1] + endCoord[1]) / 2];
  const coord3 = [startCoord[0], (startCoord[1] + endCoord[1]) / 2];
  const coord4 = [startCoord[0], endCoord[1]];
  return [startCoord, coord1, coord2, coord3, coord4];
}
