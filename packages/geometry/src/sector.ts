import type { CoordArray } from 'vesium';

/**
 * 扇形
 *
 */
import { getArcCoords, getAzimuth, mathDistance } from './helper';

export function sector(coords: CoordArray[]): CoordArray[] {
  const coordLength = coords.length;
  if (coordLength < 3) {
    throw new Error('coords.length must >= 2');
  }
  else {
    const [center, coord2, coord3] = [coords[0], coords[1], coords[2]];
    const radius = mathDistance(coord2, center);
    const startAngle = getAzimuth(coord2, center);
    const endAngle = getAzimuth(coord3, center);
    const pList = getArcCoords(center, radius, startAngle, endAngle);
    pList.push(center, pList[0]);
    return pList;
  }
}
