import type { CoordArray } from '@vesium/shared';

export const FITTING_COUNT = 100;
export const HALF_PI = Math.PI / 2;
export const ZERO_TOLERANCE = 0.0001;
export const TWO_PI = Math.PI * 2;

/**
 * 计算两个坐标之间的距离
 * @param coord1
 * @param coord2
 */
export function mathDistance(coord1: CoordArray, coord2: CoordArray): number {
  return Math.hypot(coord1[0] - coord2[0], coord1[1] - coord2[1]);
}

/**
 * 计算点集合的总距离
 * @param points
 */
export function wholeDistance(points: CoordArray[]): number {
  let distance = 0;
  if (points && Array.isArray(points) && points.length > 0) {
    points.forEach((item, index) => {
      if (index < points.length - 1) {
        distance += mathDistance(item, points[index + 1]);
      }
    });
  }
  return distance;
}
/**
 * 获取基础长度
 * @param points
 */
export const getBaseLength = (points: CoordArray[]): number => wholeDistance(points) ** 0.99;

/**
 * 求取两个坐标的中间坐标
 * @param coord1
 * @param coord2
 */
export function mid(coord1: CoordArray, coord2: CoordArray): CoordArray {
  return [
    (coord1[0] + coord2[0]) / 2,
    (coord1[1] + coord2[1]) / 2,
  ];
}

/**
 * 通过三个点确定一个圆的中心点
 * @param coord1
 * @param coord2
 * @param coord3
 */
export function getCircleCenterOfThreeCoords(coord1: CoordArray, coord2: CoordArray, coord3: CoordArray): CoordArray {
  const coordA = [(coord1[0] + coord2[0]) / 2, (coord1[1] + coord2[1]) / 2] as CoordArray;
  const coordB = [coordA[0] - coord1[1] + coord2[1], coordA[1] + coord1[0] - coord2[0]] as CoordArray;
  const coordC = [(coord1[0] + coord3[0]) / 2, (coord1[1] + coord3[1]) / 2] as CoordArray;
  const coordD = [coordC[0] - coord1[1] + coord3[1], coordC[1] + coord1[0] - coord3[0]] as CoordArray;
  return getIntersectCoord(coordA, coordB, coordC, coordD);
}

/**
 * 获取交集的点
 * @param coordA
 * @param coordB
 * @param coordC
 * @param coordD
 */
export function getIntersectCoord(coordA: CoordArray, coordB: CoordArray, coordC: CoordArray, coordD: CoordArray): CoordArray {
  if (coordA[1] === coordB[1]) {
    const f = (coordD[0] - coordC[0]) / (coordD[1] - coordC[1]);
    const x = f * (coordA[1] - coordC[1]) + coordC[0];
    const y = coordA[1];
    return [x, y];
  }
  if (coordC[1] === coordD[1]) {
    const e = (coordB[0] - coordA[0]) / (coordB[1] - coordA[1]);
    const x = e * (coordC[1] - coordA[1]) + coordA[0];
    const y = coordC[1];
    return [x, y];
  }
  const e = (coordB[0] - coordA[0]) / (coordB[1] - coordA[1]);
  const f = (coordD[0] - coordC[0]) / (coordD[1] - coordC[1]);
  const y = (e * coordA[1] - coordA[0] - f * coordC[1] + coordC[0]) / (e - f);
  const x = e * y - e * coordA[1] + coordA[0];
  return [x, y];
}

/**
 * 获取方位角（地平经度）
 * @param startCoord
 * @param endCoord
 */
export function getAzimuth(startCoord: CoordArray, endCoord: CoordArray): number {
  let azimuth = 0;
  const angle = Math.asin(Math.abs(endCoord[1] - startCoord[1]) / mathDistance(startCoord, endCoord));
  if (endCoord[1] >= startCoord[1] && endCoord[0] >= startCoord[0]) {
    azimuth = angle + Math.PI;
  }
  else if (endCoord[1] >= startCoord[1] && endCoord[0] < startCoord[0]) {
    azimuth = Math.PI * 2 - angle;
  }
  else if (endCoord[1] < startCoord[1] && endCoord[0] < startCoord[0]) {
    azimuth = angle;
  }
  else if (endCoord[1] < startCoord[1] && endCoord[0] >= startCoord[0]) {
    azimuth = Math.PI - angle;
  }
  return azimuth;
}

/**
 * 通过三个点获取方位角
 * @param coordA
 * @param coordB
 * @param coordC
 */
export function getAngleOfThreeCoords(coordA: CoordArray, coordB: CoordArray, coordC: CoordArray): number {
  const angle = getAzimuth(coordB, coordA) - getAzimuth(coordB, coordC);
  return angle < 0 ? angle + Math.PI * 2 : angle;
}

/**
 * 判断是否是顺时针
 * @param coord1
 * @param coord2
 * @param coord3
 */
export function isClockWise(coord1: CoordArray, coord2: CoordArray, coord3: CoordArray): boolean {
  return (coord3[1] - coord1[1]) * (coord2[0] - coord1[0]) > (coord2[1] - coord1[1]) * (coord3[0] - coord1[0]);
}

/**
 * 获取线上的点
 * @param t
 * @param startCoord
 * @param endCoord
 */
export function getCoordOnLine(t: number, startCoord: CoordArray, endCoord: CoordArray): CoordArray {
  const x = startCoord[0] + t * (endCoord[0] - startCoord[0]);
  const y = startCoord[1] + t * (endCoord[1] - startCoord[1]);
  return [x, y];
}

/**
 * 获取立方值
 */
export function getCubicValue(
  t: number,
  startCoord: CoordArray,
  coord1: CoordArray,
  coord2: CoordArray,
  endCoord: CoordArray,
): CoordArray {
  t = Math.max(Math.min(t, 1), 0);
  const [tp, t2] = [1 - t, t * t];
  const t3 = t2 * t;
  const tp2 = tp * tp;
  const tp3 = tp2 * tp;
  const x = tp3 * startCoord[0] + 3 * tp2 * t * coord1[0] + 3 * tp * t2 * coord2[0] + t3 * endCoord[0];
  const y = tp3 * startCoord[1] + 3 * tp2 * t * coord1[1] + 3 * tp * t2 * coord2[1] + t3 * endCoord[1];
  return [x, y];
}

/**
 * 根据起止点和旋转方向求取第三个点
 * @param startCoord
 * @param endCoord
 * @param angle
 * @param distance
 * @param clockWise
 */
export function getThirdCoord(startCoord: CoordArray, endCoord: CoordArray, angle: number, distance: number, clockWise?: boolean): CoordArray {
  const azimuth = getAzimuth(startCoord, endCoord);
  const alpha = clockWise ? azimuth + angle : azimuth - angle;
  const dx = distance * Math.cos(alpha);
  const dy = distance * Math.sin(alpha);
  return [endCoord[0] + dx, endCoord[1] + dy];
}

/**
 * 插值弓形线段点
 * @param center
 * @param radius
 * @param startAngle
 * @param endAngle
 */
export function getArcCoords(center: CoordArray, radius: number, startAngle: number, endAngle: number): CoordArray[] {
  let [x, y, coords, angleDiff]: [number, number, CoordArray[], number] = [0, 0, [], endAngle - startAngle];
  angleDiff = angleDiff < 0 ? angleDiff + Math.PI * 2 : angleDiff;
  for (let i = 0; i <= 100; i++) {
    const angle = startAngle + (angleDiff * i) / 100;
    x = center[0] + radius * Math.cos(angle);
    y = center[1] + radius * Math.sin(angle);
    coords.push([x, y]);
  }
  return coords;
}

/**
 * getBisectorNormals
 * @param t
 * @param coord1
 * @param coord2
 * @param coord3
 */
export function getBisectorNormals(t: number, coord1: CoordArray, coord2: CoordArray, coord3: CoordArray): CoordArray[] {
  const normal = getNormal(coord1, coord2, coord3);
  let [bisectorNormalRight, bisectorNormalLeft, dt, x, y]: [CoordArray, CoordArray, number, number, number] = [
    [0, 0],
    [0, 0],
    0,
    0,
    0,
  ];
  const dist = Math.hypot(normal[0], normal[1]);
  const uX = normal[0] / dist;
  const uY = normal[1] / dist;
  const d1 = mathDistance(coord1, coord2);
  const d2 = mathDistance(coord2, coord3);
  if (dist > ZERO_TOLERANCE) {
    if (isClockWise(coord1, coord2, coord3)) {
      dt = t * d1;
      x = coord2[0] - dt * uY;
      y = coord2[1] + dt * uX;
      bisectorNormalRight = [x, y];
      dt = t * d2;
      x = coord2[0] + dt * uY;
      y = coord2[1] - dt * uX;
      bisectorNormalLeft = [x, y];
    }
    else {
      dt = t * d1;
      x = coord2[0] + dt * uY;
      y = coord2[1] - dt * uX;
      bisectorNormalRight = [x, y];
      dt = t * d2;
      x = coord2[0] - dt * uY;
      y = coord2[1] + dt * uX;
      bisectorNormalLeft = [x, y];
    }
  }
  else {
    x = coord2[0] + t * (coord1[0] - coord2[0]);
    y = coord2[1] + t * (coord1[1] - coord2[1]);
    bisectorNormalRight = [x, y];
    x = coord2[0] + t * (coord3[0] - coord2[0]);
    y = coord2[1] + t * (coord3[1] - coord2[1]);
    bisectorNormalLeft = [x, y];
  }
  return [bisectorNormalRight, bisectorNormalLeft];
}

/**
 * 获取默认三点的内切圆
 * @param coord1
 * @param coord2
 * @param coord3
 */
export function getNormal(coord1: CoordArray, coord2: CoordArray, coord3: CoordArray): CoordArray {
  let dX1 = coord1[0] - coord2[0];
  let dY1 = coord1[1] - coord2[1];
  const d1 = Math.hypot(dX1, dY1);
  dX1 /= d1;
  dY1 /= d1;
  let dX2 = coord3[0] - coord2[0];
  let dY2 = coord3[1] - coord2[1];
  const d2 = Math.hypot(dX2, dY2);
  dX2 /= d2;
  dY2 /= d2;
  const uX = dX1 + dX2;
  const uY = dY1 + dY2;
  return [uX, uY];
}

/**
 * 获取左边控制点
 * @param controlCoords
 * @param t
 */
export function getLeftMostControlCoord(controlCoords: CoordArray[], t: number): CoordArray {
  let [coord1, coord2, coord3, controlX, controlY]: [CoordArray, CoordArray, CoordArray, number, number] = [
    controlCoords[0],
    controlCoords[1],
    controlCoords[2],
    0,
    0,
  ];
  const coords = getBisectorNormals(0, coord1, coord2, coord3);
  const normalRight = coords[0];
  const normal = getNormal(coord1, coord2, coord3);
  const dist = Math.hypot(normal[0], normal[1]);
  if (dist > ZERO_TOLERANCE) {
    const midCoord = mid(coord1, coord2);
    const pX = coord1[0] - midCoord[0];
    const pY = coord1[1] - midCoord[1];
    const d1 = mathDistance(coord1, coord2);
    const n = 2 / d1;
    const nX = -n * pY;
    const nY = n * pX;
    const a11 = nX * nX - nY * nY;
    const a12 = 2 * nX * nY;
    const a22 = nY * nY - nX * nX;
    const dX = normalRight[0] - midCoord[0];
    const dY = normalRight[1] - midCoord[1];
    controlX = midCoord[0] + a11 * dX + a12 * dY;
    controlY = midCoord[1] + a12 * dX + a22 * dY;
  }
  else {
    controlX = coord1[0] + t * (coord2[0] - coord1[0]);
    controlY = coord1[1] + t * (coord2[1] - coord1[1]);
  }
  return [controlX, controlY];
}

/**
 * 获取右边控制点
 * @param controlCoords
 * @param t
 */
export function getRightMostControlCoord(controlCoords: CoordArray[], t: number): CoordArray {
  const coordlength = controlCoords.length;
  const coord1 = controlCoords[coordlength - 3];
  const coord2 = controlCoords[coordlength - 2];
  const coord3 = controlCoords[coordlength - 1];
  const coords = getBisectorNormals(0, coord1, coord2, coord3);
  const normalLeft = coords[1];
  const normal = getNormal(coord1, coord2, coord3);
  const dist = Math.hypot(normal[0], normal[1]);
  let [controlX, controlY] = [0, 0];
  if (dist > ZERO_TOLERANCE) {
    const midCoord = mid(coord2, coord3);
    const pX = coord3[0] - midCoord[0];
    const pY = coord3[1] - midCoord[1];
    const d1 = mathDistance(coord2, coord3);
    const n = 2 / d1;
    const nX = -n * pY;
    const nY = n * pX;
    const a11 = nX * nX - nY * nY;
    const a12 = 2 * nX * nY;
    const a22 = nY * nY - nX * nX;
    const dX = normalLeft[0] - midCoord[0];
    const dY = normalLeft[1] - midCoord[1];
    controlX = midCoord[0] + a11 * dX + a12 * dY;
    controlY = midCoord[1] + a12 * dX + a22 * dY;
  }
  else {
    controlX = coord3[0] + t * (coord2[0] - coord3[0]);
    controlY = coord3[1] + t * (coord2[1] - coord3[1]);
  }
  return [controlX, controlY];
}

/**
 * 插值曲线点
 * @param t
 * @param controlCoords
 */
export function getCurveCoords(t: number, controlCoords: CoordArray[]): CoordArray[] {
  let normals = [getLeftMostControlCoord(controlCoords, t)];
  const coords: CoordArray[] = [];
  let coord1: CoordArray, coord2: CoordArray, coord3: CoordArray;

  for (let i = 0; i < controlCoords.length - 2; i++) {
    [coord1, coord2, coord3] = [controlCoords[i], controlCoords[i + 1], controlCoords[i + 2]];
    const normalCoords = getBisectorNormals(t, coord1, coord2, coord3);
    normals = normals.concat(normalCoords);
  }
  const rightControl = getRightMostControlCoord(controlCoords, t);
  if (rightControl) {
    normals.push(rightControl);
  }
  for (let i = 0; i < controlCoords.length - 1; i++) {
    coord1 = controlCoords[i];
    coord2 = controlCoords[i + 1];
    coords.push(coord1);
    for (let j = 0; j < FITTING_COUNT; j++) {
      const coord = getCubicValue(j / FITTING_COUNT, coord1, normals[i * 2], normals[i * 2 + 1], coord2);
      coords.push(coord);
    }
    coords.push(coord2);
  }
  return coords;
}

/**
 * 贝塞尔曲线
 * @param points
 */
export function getBezierCoords(points: CoordArray[]): CoordArray[] {
  if (points.length <= 2) {
    return points;
  }
  const bezierCoords: CoordArray[] = [];
  const n = points.length - 1;
  for (let t = 0; t <= 1; t += 0.01) {
    let [x, y] = [0, 0];
    for (let index = 0; index <= n; index++) {
      const factor = getBinomialFactor(n, index);
      const a = t ** index;
      const b = (1 - t) ** (n - index);
      x += factor * a * b * points[index][0];
      y += factor * a * b * points[index][1];
    }
    bezierCoords.push([x, y]);
  }
  bezierCoords.push(points[n]);
  return bezierCoords;
}

/**
 * 获取阶乘数据
 * @param n
 */
export function getFactorial(n: number): number {
  let result = 1;
  switch (true) {
    case n <= 1:
      result = 1;
      break;
    case n === 2:
      result = 2;
      break;
    case n === 3:
      result = 6;
      break;
    case n === 24:
      result = 24;
      break;
    case n === 5:
      result = 120;
      break;
    default:
      for (let i = 1; i <= n; i++) {
        result *= i;
      }
      break;
  }
  return result;
}

/**
 * 获取二项分布
 * @param n
 * @param index
 */
export function getBinomialFactor(n: number, index: number): number {
  return getFactorial(n) / (getFactorial(index) * getFactorial(n - index));
}

/**
 * 插值线性点
 * @param points
 */
export function getQBSplineCoords(points: CoordArray[]): CoordArray[] {
  if (points.length <= 2) {
    return points;
  }
  const [n, bSplineCoords]: [number, CoordArray[]] = [2, []];
  const m = points.length - n - 1;
  bSplineCoords.push(points[0]);
  for (let i = 0; i <= m; i++) {
    for (let t = 0; t <= 1; t += 0.05) {
      let [x, y] = [0, 0];
      for (let k = 0; k <= n; k++) {
        const factor = getQuadricBSplineFactor(k, t);
        x += factor * points[i + k][0];
        y += factor * points[i + k][1];
      }
      bSplineCoords.push([x, y]);
    }
  }
  bSplineCoords.push(points.at(-1)!);
  return bSplineCoords;
}

/**
 * 得到二次线性因子
 * @param k
 * @param t
 */
export function getQuadricBSplineFactor(k: number, t: number): number {
  let res = 0;
  if (k === 0) {
    res = (t - 1) ** 2 / 2;
  }
  else if (k === 1) {
    res = (-2 * t ** 2 + 2 * t + 1) / 2;
  }
  else if (k === 2) {
    res = t ** 2 / 2;
  }
  return res;
}
