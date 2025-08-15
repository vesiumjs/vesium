import type { CoordArray } from 'vesium';

import {
  getAngleOfThreeCoords,
  getBaseLength,
  getQBSplineCoords,
  getThirdCoord,
  HALF_PI,
  isClockWise,
  mathDistance,
  mid,
  wholeDistance,
} from './helper';

export interface AttackArrowOptions {
  headWidthFactor?: number;
  headHeightFactor?: number;
  neckWidthFactor?: number;
  neckHeightFactor?: number;
  tailWidthFactor?: number;
  headTailFactor?: number;
  swallowTailFactor?: number;
  swallowTailCoord?: CoordArray;
}
/**
 * 尖曲箭头
 */
export function arrowAttackDirection(coords: CoordArray[], options: AttackArrowOptions = {}): CoordArray[] {
  const coordLength = coords.length;
  if (coordLength < 3) {
    throw new Error('coords.length must >= 3');
  }
  else {
    let [tailLeft, tailRight] = [coords[0], coords[1]];
    if (isClockWise(coords[0], coords[1], coords[2])) {
      tailLeft = coords[1];
      tailRight = coords[0];
    }
    const midTail = mid(tailLeft, tailRight);
    const boneCoords = [midTail].concat(coords.slice(2));
    const headCoords = getArrowHeadCoords(boneCoords, {
      tailLeft,
      tailRight,
      ...options,
    });
    if (headCoords && headCoords.length > 4) {
      const [neckLeft, neckRight] = [headCoords[0], headCoords[4]];
      const tailWidthFactor = mathDistance(tailLeft, tailRight) / getBaseLength(boneCoords);
      const bodyCoords = getArrowBodyCoords(boneCoords, neckLeft, neckRight, tailWidthFactor);
      const coordlength = bodyCoords.length;
      let leftCoords = [tailLeft].concat(bodyCoords.slice(0, coordlength / 2));
      leftCoords.push(neckLeft);
      let rightCoords = [tailRight].concat(bodyCoords.slice(coordlength / 2, coordlength));
      rightCoords.push(neckRight);
      leftCoords = getQBSplineCoords(leftCoords);
      rightCoords = getQBSplineCoords(rightCoords);
      return leftCoords.concat(headCoords, rightCoords.reverse());
    }
    else {
      return [];
    }
  }
}

export interface GetArrowCoordsOptions {
  tailLeft?: CoordArray;
  tailRight?: CoordArray;
  headHeightFactor?: number;
  headTailFactor?: number;
  headWidthFactor?: number;
  neckWidthFactor?: number;
  neckHeightFactor?: number;
}

/**
 * 插值箭形上的点
 * @param coord1
 * @param coord2
 * @param coord3
 * @param clockWise
 */
export function getArrowCoords(
  coord1: CoordArray,
  coord2: CoordArray,
  coord3: CoordArray,
  clockWise: boolean,
  options: GetArrowCoordsOptions = {},
): CoordArray[] | undefined {
  const midCoord = mid(coord1, coord2);
  const len = mathDistance(midCoord, coord3);
  let midCoord1 = getThirdCoord(coord3, midCoord, 0, len * 0.3, true);
  let midCoord2 = getThirdCoord(coord3, midCoord, 0, len * 0.5, true);
  midCoord1 = getThirdCoord(midCoord, midCoord1, HALF_PI, len / 5, clockWise);
  midCoord2 = getThirdCoord(midCoord, midCoord2, HALF_PI, len / 4, clockWise);
  const points = [midCoord, midCoord1, midCoord2, coord3];
  const arrowCoords = getArrowHeadCoords(points, options);
  if (arrowCoords && Array.isArray(arrowCoords) && arrowCoords.length > 0) {
    const [neckLeftCoord, neckRightCoord] = [arrowCoords[0], arrowCoords[4]];
    const tailWidthFactor = mathDistance(coord1, coord2) / getBaseLength(points) / 2;
    const bodyCoords = getArrowBodyCoords(points, neckLeftCoord, neckRightCoord, tailWidthFactor);
    if (bodyCoords) {
      const n = bodyCoords.length;
      let lCoords = bodyCoords.slice(0, n / 2);
      let rCoords = bodyCoords.slice(n / 2, n);
      lCoords.push(neckLeftCoord);
      rCoords.push(neckRightCoord);
      lCoords = lCoords.reverse();
      lCoords.push(coord2);
      rCoords = rCoords.reverse();
      rCoords.push(coord1);
      return lCoords.reverse().concat(arrowCoords, rCoords);
    }
  }
  else {
    throw new Error('插值出错');
  }
}

export interface GetArrowHeadCoordsOptions {
  tailLeft?: CoordArray;
  tailRight?: CoordArray;
  headHeightFactor?: number;
  headTailFactor?: number;
  headWidthFactor?: number;
  neckWidthFactor?: number;
  neckHeightFactor?: number;
}

/**
 * 插值头部点
 */
export function getArrowHeadCoords(points: CoordArray[], options: GetArrowHeadCoordsOptions): CoordArray[] {
  const {
    tailLeft,
    tailRight,
    headHeightFactor = 0.18,
    headWidthFactor = 0.3,
    neckHeightFactor = 0.85,
    neckWidthFactor = 0.15,
    headTailFactor = 0.8,
  } = options;

  let len = getBaseLength(points);
  let headHeight = len * headHeightFactor;
  const headCoord = points.at(-1)!;
  len = mathDistance(headCoord, points.at(-2)!);
  let tailWidth = 0;
  if (tailLeft && tailRight) {
    tailWidth = mathDistance(tailLeft, tailRight);
  }
  if (headHeight > tailWidth * headTailFactor) {
    headHeight = tailWidth * headTailFactor;
  }
  const headWidth = headHeight * headWidthFactor;
  const neckWidth = headHeight * neckWidthFactor;
  headHeight = Math.min(headHeight, len);
  const neckHeight = headHeight * neckHeightFactor;
  const headEndCoord = getThirdCoord(points.at(-2)!, headCoord, 0, headHeight, true);
  const neckEndCoord = getThirdCoord(points.at(-2)!, headCoord, 0, neckHeight, true);
  const headLeft = getThirdCoord(headCoord, headEndCoord, HALF_PI, headWidth, false);
  const headRight = getThirdCoord(headCoord, headEndCoord, HALF_PI, headWidth, true);
  const neckLeft = getThirdCoord(headCoord, neckEndCoord, HALF_PI, neckWidth, false);
  const neckRight = getThirdCoord(headCoord, neckEndCoord, HALF_PI, neckWidth, true);
  return [neckLeft, headLeft, headCoord, headRight, neckRight];
}

/**
 * 插值面部分数据
 * @param points
 * @param neckLeft
 * @param neckRight
 * @param tailWidthFactor
 */
export function getArrowBodyCoords(points: CoordArray[], neckLeft: CoordArray, neckRight: CoordArray, tailWidthFactor: number): Array<CoordArray> {
  const allLen = wholeDistance(points);
  const len = getBaseLength(points);
  const tailWidth = len * tailWidthFactor;
  const neckWidth = mathDistance(neckLeft, neckRight);
  const widthDif = (tailWidth - neckWidth) / 2;

  let tempLen = 0;
  const leftBodyCoords: CoordArray[] = [];
  const rightBodyCoords: CoordArray[] = [];
  for (let i = 1; i < points.length - 1; i++) {
    const angle = getAngleOfThreeCoords(points[i - 1], points[i], points[i + 1]) / 2;
    tempLen += mathDistance(points[i - 1], points[i]);
    const w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
    const left = getThirdCoord(points[i - 1], points[i], Math.PI - angle, w, true);
    const right = getThirdCoord(points[i - 1], points[i], angle, w, false);
    leftBodyCoords.push(left);
    rightBodyCoords.push(right);
  }
  return leftBodyCoords.concat(rightBodyCoords);
}

/**
 * 获取对称点
 * @param lineCoord1
 * @param lineCoord2
 * @param coord
 */
export function getTempCoord4(lineCoord1: CoordArray, lineCoord2: CoordArray, coord: CoordArray): CoordArray {
  const midCoord = mid(lineCoord1, lineCoord2);
  const len = mathDistance(midCoord, coord);
  const angle = getAngleOfThreeCoords(lineCoord1, midCoord, coord);
  let symCoord;
  let distance1 = 0;
  let distance2 = 0;
  let midCoord2: CoordArray;
  if (angle < HALF_PI) {
    distance1 = len * Math.sin(angle);
    distance2 = len * Math.cos(angle);
    midCoord2 = getThirdCoord(lineCoord1, midCoord, HALF_PI, distance1, false);
    symCoord = getThirdCoord(midCoord, midCoord2, HALF_PI, distance2, true);
  }
  else if (angle >= HALF_PI && angle < Math.PI) {
    distance1 = len * Math.sin(Math.PI - angle);
    distance2 = len * Math.cos(Math.PI - angle);
    midCoord2 = getThirdCoord(lineCoord1, midCoord, HALF_PI, distance1, false);
    symCoord = getThirdCoord(midCoord, midCoord2, HALF_PI, distance2, false);
  }
  else if (angle >= Math.PI && angle < Math.PI * 1.5) {
    distance1 = len * Math.sin(angle - Math.PI);
    distance2 = len * Math.cos(angle - Math.PI);
    midCoord2 = getThirdCoord(lineCoord1, midCoord, HALF_PI, distance1, true);
    symCoord = getThirdCoord(midCoord, midCoord2, HALF_PI, distance2, true);
  }
  else {
    distance1 = len * Math.sin(Math.PI * 2 - angle);
    distance2 = len * Math.cos(Math.PI * 2 - angle);
    midCoord2 = getThirdCoord(lineCoord1, midCoord, HALF_PI, distance1, true);
    symCoord = getThirdCoord(midCoord, midCoord2, HALF_PI, distance2, false);
  }
  return symCoord;
}
