import type { CoordArray } from '@vesium/shared';
import { getBaseLength, getThirdCoord, HALF_PI } from './helper';

export interface FineArrowOptions {
  neckAngle?: number;
  headAngle?: number;
  headWidthFactor?: number;
  neckWidthFactor?: number;
  tailWidthFactor?: number;
}

/**
 * 尖箭头
 *
 */
export function arrowStraightSharp(coords: CoordArray[], options: FineArrowOptions = {}): CoordArray[] {
  const {
    tailWidthFactor = 0.1,
    neckWidthFactor = 0.2,
    headWidthFactor = 0.25,
    headAngle = Math.PI / 8.5,
    neckAngle = Math.PI / 13,
  } = options;

  const coordlength = coords.length;

  if (coordlength < 2) {
    throw new Error('coords.length must >= 2');
  }

  const [coord1, coord2] = [coords[0], coords[1]];
  const len = getBaseLength(coords);
  const tailWidth = len * tailWidthFactor;
  const neckWidth = len * neckWidthFactor;
  const headWidth = len * headWidthFactor;
  const tailLeft = getThirdCoord(coord2, coord1, HALF_PI, tailWidth, true);
  const tailRight = getThirdCoord(coord2, coord1, HALF_PI, tailWidth, false);
  const headLeft = getThirdCoord(coord1, coord2, headAngle, headWidth, false);
  const headRight = getThirdCoord(coord1, coord2, headAngle, headWidth, true);
  const neckLeft = getThirdCoord(coord1, coord2, neckAngle, neckWidth, false);
  const neckRight = getThirdCoord(coord1, coord2, neckAngle, neckWidth, true);
  const pList = [tailLeft, neckLeft, headLeft, coord2, headRight, neckRight, tailRight];
  return pList;
}
