import type { CoordArray } from 'vesium';

import { FITTING_COUNT, mid } from './helper';

/**
 * 标绘画椭圆算法，继承面要素相关方法和属性
 */
export function ellipse(coords: CoordArray[]): CoordArray[] {
  const coordLength = coords.length;

  if (coordLength < 2) {
    throw new Error('coords.length must >= 2');
  }
  const [coord1, coord2] = [coords[0], coords[1]];
  const center = mid(coord1, coord2);
  const majorRadius = Math.abs((coord1[0] - coord2[0]) / 2);
  const minorRadius = Math.abs((coord1[1] - coord2[1]) / 2);
  let [x, y, angle] = [0, 0, 0];
  const _coords: CoordArray[] = [];
  for (let i = 0; i <= FITTING_COUNT; i++) {
    angle = (Math.PI * 2 * i) / FITTING_COUNT;
    x = center[0] + majorRadius * Math.cos(angle);
    y = center[1] + minorRadius * Math.sin(angle);
    coords.push([x, y]);
  }
  return _coords;
}
