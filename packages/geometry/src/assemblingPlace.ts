import type { CoordArray } from '@vesium/shared';
import { FITTING_COUNT, getBisectorNormals, getCubicValue, mid } from './helper';

/**
 * 集结地
 *
 */
export function assemblingPlace(coords: CoordArray[]): CoordArray[] {
  if (coords.length < 3) {
    throw new Error(`coords.length must >= 3`);
  }
  const t = 0.4;

  const midCoord = mid(coords[0], coords[2]);
  coords.push(midCoord, coords[0], coords[1]);
  let normals: CoordArray[] = [];
  const pList: CoordArray[] = [];
  for (let i = 0; i < coords.length - 2; i++) {
    const coord1 = coords[i];
    const coord2 = coords[i + 1];
    const coord3 = coords[i + 2];
    const normalCoords = getBisectorNormals(t, coord1, coord2, coord3);
    normals = normals.concat(normalCoords);
  }
  const count = normals.length;
  normals = [normals[count - 1]].concat(normals.slice(0, count - 1));
  for (let i = 0; i < coords.length - 2; i++) {
    const coord1 = coords[i];
    const coord2 = coords[i + 1];
    pList.push(coord1);
    for (let t = 0; t <= FITTING_COUNT; t++) {
      const coord = getCubicValue(t / FITTING_COUNT, coord1, normals[i * 2], normals[i * 2 + 1], coord2);
      pList.push(coord);
    }
    pList.push(coord2);
  }
  return pList;
}
