import type { CoordArray } from '@vesium/shared';
import {
  getArcCoords,
  getAzimuth,
  getCircleCenterOfThreeCoords,
  getThirdCoord,
  HALF_PI,
  isClockWise,
  mathDistance,
  mid,
} from './helper';

//

/**
 * 弓形
 */
export function lune(coords: CoordArray[]): CoordArray[] {
  coords = [...coords];
  const coordLength = coords.length;

  if (coordLength < 2) {
    throw new Error('coords.length must >= 2');
  }

  if (coordLength === 2) {
    const midCoord = mid(coords[0], coords[1]);
    const d = mathDistance(coords[0], midCoord);
    const coord = getThirdCoord(coords[0], midCoord, HALF_PI, d);
    coords.push(coord);
  }

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
  coords = getArcCoords(center, radius, startAngle, endAngle);
  coords.push(coords[0]);
  return coords;
}
