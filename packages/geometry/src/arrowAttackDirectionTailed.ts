import type { CoordArray } from 'vesium';
import { getArrowBodyCoords, getArrowHeadCoords } from './arrowAttackDirection';
import { getBaseLength, getQBSplineCoords, getThirdCoord, isClockWise, mathDistance, mid } from './helper';

export interface TailedAttackArrowOptions {
  headHeightFactor?: number;
  headWidthFactor?: number;
  neckHeightFactor?: number;
  neckWidthFactor?: number;
  tailWidthFactor?: number;
  swallowTailFactor?: number;
}

/**
 * 燕尾尖曲箭头
 */
export function arrowAttackDirectionTailed(coords: CoordArray[], options: TailedAttackArrowOptions = {}): CoordArray[] {
  const {
    headHeightFactor = 0.18,
    headWidthFactor = 0.3,
    neckHeightFactor = 0.85,
    neckWidthFactor = 0.15,
    tailWidthFactor = 0.1,
    swallowTailFactor = 1,
  } = options;

  const coordLength = coords.length;
  if (coordLength < 3) {
    throw new Error('coords.length must >= 3');
  }

  let [tailLeft, tailRight] = [coords[0], coords[1]];
  if (isClockWise(coords[0], coords[1], coords[2])) {
    tailLeft = coords[1];
    tailRight = coords[0];
  }
  const midTail = mid(tailLeft, tailRight);
  const boneCoords = [midTail].concat(coords.slice(2));
  const headCoords = getArrowHeadCoords(boneCoords, {
    tailLeft,
    tailRight,
    headHeightFactor,
    headWidthFactor,
    neckWidthFactor,
    neckHeightFactor,
  });
  if (headCoords && headCoords.length > 4) {
    const [neckLeft, neckRight] = [headCoords[0], headCoords[4]];
    const tailWidth = mathDistance(tailLeft, tailRight);
    const allLen = getBaseLength(boneCoords);
    const len = allLen * tailWidthFactor * swallowTailFactor;
    const swallowTailCoord = getThirdCoord(boneCoords[1], boneCoords[0], 0, len, true);
    const factor = tailWidth / allLen;
    const bodyCoords = getArrowBodyCoords(boneCoords, neckLeft, neckRight, factor);
    const coordlength = bodyCoords.length;
    let leftCoords = [tailLeft].concat(bodyCoords.slice(0, coordlength / 2));
    leftCoords.push(neckLeft);
    let rightCoords = [tailRight].concat(bodyCoords.slice(coordlength / 2, coordlength));
    rightCoords.push(neckRight);
    leftCoords = getQBSplineCoords(leftCoords);
    rightCoords = getQBSplineCoords(rightCoords);
    return leftCoords.concat(headCoords, rightCoords.reverse(), [swallowTailCoord, leftCoords[0]]);
  }
  else {
    return [];
  }
}
