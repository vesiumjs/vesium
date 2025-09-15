import type { CoordArray } from '@vesium/shared';

/**
 * 斜矩形2
 *
 */
export function rectinclined2(coords: CoordArray[]): CoordArray[] {
  const coordLength = coords.length;
  if (coordLength < 3) {
    throw new Error('coords.length must >= 3');
  }
  else {
    const [coord1, coord2, mouse] = [coords[0], coords[1], coords[2]];
    const intersect = calculateIntersectionCoord(coord1, coord2, mouse);
    const coord4 = calculateFourthCoord(coord1, intersect, mouse);
    const pList: CoordArray[] = [];
    pList.push(coord1, intersect, mouse, coord4, coord1);
    return pList;
  }
}

/**
 * 已知p1，p2，p3点求矩形的p4点
 * @param {*} p1
 * @param {*} p2
 * @param {*} p3
 */
export function calculateFourthCoord(p1, p2, p3): CoordArray {
  const x = p1[0] + p3[0] - p2[0];
  const y = p1[1] + p3[1] - p2[1];
  return [x, y];
}

/**
 * 已知p1点和p2点，求p3点到p1p2垂线的交点
 * @param {*} p1
 * @param {*} p2
 * @param {*} p3
 */
export function calculateIntersectionCoord(p1, p2, p3): CoordArray {
  const v = {
    x: p2[0] - p1[0],
    y: p2[1] - p1[1],
  };
  const u = {
    x: p3[0] - p1[0],
    y: p3[1] - p1[1],
  };
  const projectionLength = (u.x * v.x + u.y * v.y) / (v.x * v.x + v.y * v.y);
  const intersectionCoord: { x: number; y: number } = {
    x: p1[0] + v.x * projectionLength,
    y: p1[1] + v.y * projectionLength,
  };
  return [intersectionCoord.x, intersectionCoord.y];
}
