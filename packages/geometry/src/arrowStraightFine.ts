import type { CoordArray } from 'vesium';
import { getThirdCoord, mathDistance } from './helper';

/**
 * 细直箭头
 */
export function arrowStraightFine(coords: CoordArray[]): CoordArray[] {
  const maxArrowLength = 3000000;
  const arrowLengthScale = 5;

  const coordlength = coords.length;
  if (coordlength < 2) {
    throw new Error('coords.length must >= 2');
  }

  const [coord1, coord2] = [coords[0], coords[1]];
  const distance = mathDistance(coord1, coord2);
  let len = distance / arrowLengthScale;
  len = Math.min(len, maxArrowLength);
  const leftCoord = getThirdCoord(coord1, coord2, Math.PI / 6, len, false);
  const rightCoord = getThirdCoord(coord1, coord2, Math.PI / 6, len, true);
  return [coord1, coord2, leftCoord, coord2, rightCoord];
}
