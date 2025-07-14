import type { CoordArray } from 'vesium';

/**
 * 斜矩形1
 *
 */
export function rectinclined1(coords: CoordArray[]): CoordArray[] {
  const coordLength = coords.length;
  if (coordLength < 3) {
    throw new Error('coords.length must >= 3');
  }
  else {
    const [coord1, coord2, mouse] = [coords[0], coords[1], coords[2]];
    const d = calculatePerpendicularDistance(coord1, coord2, mouse);
    const direction = calculatePositionRelativeToLine(coord1, coord2, mouse);
    const coord3 = calculatePerpendicularCoord(coord1, coord2, direction * d);
    const coord4 = calculateFourthCoord(coord1, coord2, coord3);
    const pList: CoordArray[] = [];
    pList.push(coord1, coord2, coord3, coord4, coord1);
    return pList;
  }
}

/**
 * 已知p1，p2，p3三点，计算p3到p1p2的垂直距离
 * @param {*} p1
 * @param {*} p2
 * @param {*} p3
 */
export function calculatePerpendicularDistance(p1, p2, p3) {
  // 计算向量V的分量
  const vx = p2[0] - p1[0];
  const vy = p2[1] - p1[1];
  // 计算P1P3的分量
  const px = p3[0] - p1[0];
  const py = p3[1] - p1[1];
  // 计算向量V的模长
  const vMagnitude = Math.hypot(vx, vy);
  // 计算点积
  const dotProduct = px * vx + py * vy;
  // 计算投影长度
  const projectionLength = dotProduct / vMagnitude;
  // 计算P1P3的模长
  const pMagnitude = Math.hypot(px, py);
  // 计算垂直距离
  const perpendicularDistance = Math.sqrt(pMagnitude * pMagnitude - projectionLength * projectionLength);
  return perpendicularDistance;
}

/**
 * 已知p1，p2，两点，判断p3点在p1p2的左右，返回-1右侧，0线上，1左侧
 * @param {*} p1
 * @param {*} p2
 * @param {*} p3
 */
export function calculatePositionRelativeToLine(p1, p2, p3) {
  const v1 = {
    x: p2[0] - p1[0],
    y: p2[1] - p1[1],
  };
  const v2 = {
    x: p3[0] - p1[0],
    y: p3[1] - p1[1],
  };
  const crossProduct = v1.x * v2.y - v1.y * v2.x;
  const direction = crossProduct > 0 ? 1 : -1;
  if (p1[1] > p2[1]) {
    return direction;
  }
  return -direction;
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
 * 已知p1，p2两点和距离d，求距离p1p2垂直距离为d的点p3
 * @param {*} p1
 * @param {*} p2
 * @param {*} d
 */
export function calculatePerpendicularCoord(p1, p2, d): CoordArray {
  // 计算p1p2的斜率
  const m = (p2[1] - p1[1]) / (p2[0] - p1[0]);

  let x, y;
  // 计算垂线的斜率
  if (m !== 0) {
    const perpendicularSlope = -1 / m;
    // 根据垂线斜率和已知点p2的坐标，得到垂线方程中的常数项
    const c = p2[1] - perpendicularSlope * p2[0];
    // 解垂线方程，求解x和y的值
    x = d * Math.sqrt(1 / (1 + perpendicularSlope ** 2)) + p2[0];
    y = perpendicularSlope * x + c;
  }
  else {
    x = p2[0];
    y = p2[1] - d;
  }
  // 返回垂线另一端点的坐标
  return [x, y];
}
