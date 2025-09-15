import type { CoordArray } from 'vesium';
import { mathDistance } from './helper';

/**
 * 标绘画圆算法，继承面要素相关方法和属性
 */
export function circle(coords: CoordArray[]): CoordArray[] {
  const coordlength = coords.length;
  if (coordlength < 2) {
    throw new Error('coords.length must >= 2');
  }
  const center = coords[0];
  const radius = mathDistance(center as CoordArray, coords[1]);
  let [x, y, angle] = [0, 0, 0];
  const _coords: CoordArray[] = [];
  for (let i = 0; i <= 100; i++) {
    angle = (Math.PI * 2 * i) / 100;
    x = center[0] + radius * Math.cos(angle);
    y = center[1] + radius * Math.sin(angle);
    _coords.push([x, y]);
  }
  return _coords;
}
