import type { CoordArray } from 'vesium';
import { getArcCoords, getAzimuth, getCircleCenterOfThreeCoords, isClockWise, mathDistance } from './helper';

/**
 * 标绘画弓形算法，继承线要素相关方法和属性
 */
export function arc(coords: CoordArray[]): CoordArray[] {
  const coordlength = coords.length;

  if (coordlength <= 2) {
    throw new Error('coords.length must >= 3');
  }
  else {
    let [coord1, coord2, coord3, startAngle, endAngle] = [coords[0], coords[1], coords[2], 0, 0];
    const center = getCircleCenterOfThreeCoords(coord1, coord2, coord3);
    const radius = mathDistance(coord1, center);
    const angle1 = getAzimuth(coord1, center);
    const angle2 = getAzimuth(coord2, center);
    if (isClockWise(coord1, coord2, coord3)) {
      startAngle = angle2;
      endAngle = angle1;
    }
    else {
      startAngle = angle1;
      endAngle = angle2;
    }
    return getArcCoords(center, radius, startAngle, endAngle);
  }
}
