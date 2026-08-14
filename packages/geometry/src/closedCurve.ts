import type { CoordArray } from '@vesium/shared';
import { FITTING_COUNT, getBisectorNormals, getCubicValue } from './helper';
/**
 * 闭合曲面
 *
 */
export function closedCurve(coords: CoordArray[]): CoordArray[] {
  const t = 0.3;
  const coordLength = coords.length;
  if (coordLength < 3) {
    throw new Error('coords.length must >= 3');
  }
  else {
    const points = [...coords, coords[0], coords[1]];
    let normals: CoordArray[] = [];
    const pList: CoordArray[] = [];
    for (let i = 0; i < points.length - 2; i++) {
      const normalCoords = getBisectorNormals(t, points[i], points[i + 1], points[i + 2]);
      normals = normals.concat(normalCoords);
    }
    const coordlength = normals.length;
    normals = [normals[coordlength - 1]].concat(normals.slice(0, coordlength - 1));
    for (let i = 0; i < points.length - 2; i++) {
      const coord1 = points[i];
      const coord2 = points[i + 1];
      pList.push(coord1);
      for (let t = 0; t <= FITTING_COUNT; t++) {
        const coord = getCubicValue(t / FITTING_COUNT, coord1, normals[i * 2], normals[i * 2 + 1], coord2);
        pList.push(coord);
      }
      pList.push(coord2);
    }
    return pList;
  }
}
