import type { CoordArray } from 'vesium';

/**
 * 规则矩形
 *
 */
export function rectAngle(coords: CoordArray[]): CoordArray[] {
  if (coords.length < 2) {
    throw new Error('coords.length must >= 2');
  }
  const [startCoord, endCoord] = coords;
  return [startCoord, [startCoord[0], endCoord[1]], endCoord, [endCoord[0], startCoord[1]], startCoord];
}
