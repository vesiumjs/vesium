import type { CoordArray } from 'vesium';
import { getArrowBodyCoords, getArrowHeadCoords } from './arrowAttackDirection';
import { getBaseLength, getQBSplineCoords, getThirdCoord, HALF_PI } from './helper';

export interface TailedSquadCombatOptions {
  headHeightFactor?: number;
  headWidthFactor?: number;
  neckHeightFactor?: number;
  neckWidthFactor?: number;
  tailWidthFactor?: number;
  headTailFactor?: number;
  swallowTailFactor?: number;
  swallowTailCoord?: CoordArray;
}

/**
 * 燕尾尖箭头
 */
export function arrowUnitCombatOperationTailed(coords: CoordArray[], options: TailedSquadCombatOptions = {}): CoordArray[] {
  const {
    headHeightFactor = 0.18,
    headWidthFactor = 0.3,
    neckHeightFactor = 0.85,
    neckWidthFactor = 0.15,
    tailWidthFactor = 0.1,
    swallowTailFactor = 1,
  } = options;
  const coordlength = coords.length;
  if (coordlength < 2) {
    throw new Error('coords.length must >= 2');
  }
  const allLen = getBaseLength(coords);
  const tailWidth = allLen * tailWidthFactor;
  const tailLeft = getThirdCoord(coords[1], coords[0], HALF_PI, tailWidth, false);
  const tailRight = getThirdCoord(coords[1], coords[0], HALF_PI, tailWidth, true);
  const len = tailWidth * swallowTailFactor;
  const swallowTailCoord = getThirdCoord(coords[1], coords[0], 0, len, true);
  const tailCoords = [tailLeft, swallowTailCoord, tailRight];

  const headCoords = getArrowHeadCoords(coords, {
    tailLeft: tailCoords[0],
    tailRight: tailCoords[2],
    headHeightFactor,
    headWidthFactor,
    neckWidthFactor,
    neckHeightFactor,
  });
  if (headCoords && headCoords.length > 4) {
    const neckLeft = headCoords[0];
    const neckRight = headCoords[4];
    const bodyCoords = getArrowBodyCoords(coords, neckLeft, neckRight, tailWidthFactor);

    const coordlength = bodyCoords.length;
    let leftCoords = [tailCoords[0]].concat(bodyCoords.slice(0, coordlength / 2));
    leftCoords.push(neckLeft);
    let rightCoords = [tailCoords[2]].concat(bodyCoords.slice(coordlength / 2, coordlength));
    rightCoords.push(neckRight);
    leftCoords = getQBSplineCoords(leftCoords);
    rightCoords = getQBSplineCoords(rightCoords);
    return leftCoords.concat(headCoords, rightCoords.reverse(), [tailCoords[1], leftCoords[0]]);
  }
  return [];
}
