import type { CoordArray } from '@vesium/shared';
import { arrowStraightSharp } from './arrowStraightSharp';

/**
 * 直箭头
 */
export function arrowStraight(coords: CoordArray[]): CoordArray[] {
  const tailWidthFactor = 0.05;
  const neckWidthFactor = 0.1;
  const headWidthFactor = 0.15;

  const headAngle = Math.PI / 4;
  const neckAngle = Math.PI * 0.17741;
  return arrowStraightSharp(coords, {
    tailWidthFactor,
    neckWidthFactor,
    headWidthFactor,
    headAngle,
    neckAngle,
  });
}
