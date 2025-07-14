import type { CoordArray } from 'vesium';

import { getCurveCoords } from './helper';
/**
 * 标绘曲线算法
 */
export function curve(coords: CoordArray[]): CoordArray[] {
  const t = 0.3;
  const coordlength = coords.length;
  if (coordlength < 3) {
    throw new Error('coords.length must >= 2');
  }
  else {
    return getCurveCoords(t, coords);
  }
}
