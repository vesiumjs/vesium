import type { CoordArray } from '@vesium/shared';
import {
  getAngleOfThreeCoords,
  getBaseLength,
  getBezierCoords,
  getThirdCoord,
  HALF_PI,
  isClockWise,
  mathDistance,
  mid,
  wholeDistance,
} from './helper';

/**
 * 钳击箭头 有效点位长度3,4,5
 */
export function arrowClamped(coords: CoordArray[]): CoordArray[] {
  const options = {
    headHeightFactor: 0.25,
    headWidthFactor: 0.3,
    neckHeightFactor: 0.85,
    neckWidthFactor: 0.15,
  };

  if (coords.length < 3) {
    throw new Error(`coords.length must >= 3`);
  }
  const [coord1, coord2, coord3] = coords;
  let tempCoord4: CoordArray, connCoord: CoordArray;
  if (coords.length === 3) {
    tempCoord4 = getTempCoord4(coord1, coord2, coord3);
    connCoord = mid(coord1, coord2);
  }
  else if (coords.length === 4) {
    tempCoord4 = coords[3];
    connCoord = mid(coord1, coord2);
  }
  else {
    tempCoord4 = coords[3];
    connCoord = coords[4];
  }
  let leftArrowCoords: CoordArray[];
  let rightArrowCoords: CoordArray[];
  if (isClockWise(coord1, coord2, coord3)) {
    leftArrowCoords = getArrowCoords(coord1, connCoord, tempCoord4, false, options);
    rightArrowCoords = getArrowCoords(connCoord, coord2, coord3, true, options);
  }
  else {
    leftArrowCoords = getArrowCoords(coord2, connCoord, coord3, false, options);
    rightArrowCoords = getArrowCoords(connCoord, coord1, tempCoord4, true, options);
  }
  const m = leftArrowCoords.length;
  const t = (m - 5) / 2;
  const llBodyCoords = leftArrowCoords.slice(0, t);
  const lArrowCoords = leftArrowCoords.slice(t, t + 5);
  let lrBodyCoords = leftArrowCoords.slice(t + 5, m);
  let rlBodyCoords = rightArrowCoords.slice(0, t);
  const rArrowCoords = rightArrowCoords.slice(t, t + 5);
  const rrBodyCoords = rightArrowCoords.slice(t + 5, m);
  rlBodyCoords = getBezierCoords(rlBodyCoords);
  const bodyCoords = getBezierCoords(rrBodyCoords.concat(llBodyCoords.slice(1)));
  lrBodyCoords = getBezierCoords(lrBodyCoords);
  return rlBodyCoords.concat(rArrowCoords, bodyCoords, lArrowCoords, lrBodyCoords);
}

/**
 * 插值箭形上的点
 * @param coord1  - Wgs84坐标
 * @param coord2 - Wgs84坐标
 * @param coord3 - Wgs84坐标
 * @param clockWise - 是否顺时针
 */
function getArrowCoords(
  coord1: CoordArray,
  coord2: CoordArray,
  coord3: CoordArray,
  clockWise: boolean,
  options: GetArrowHeadCoordsOptions,
): CoordArray[] {
  const midCoord = mid(coord1, coord2);
  const len = mathDistance(midCoord, coord3);
  let midCoord1 = getThirdCoord(coord3, midCoord, 0, len * 0.3, true);
  let midCoord2 = getThirdCoord(coord3, midCoord, 0, len * 0.5, true);
  midCoord1 = getThirdCoord(midCoord, midCoord1, HALF_PI, len / 5, clockWise);
  midCoord2 = getThirdCoord(midCoord, midCoord2, HALF_PI, len / 4, clockWise);
  const coords = [midCoord, midCoord1, midCoord2, coord3];
  const arrowCoords = getArrowHeadCoords(coords, options);
  if (arrowCoords && Array.isArray(arrowCoords) && arrowCoords.length > 0) {
    const [neckLeftCoord, neckRightCoord] = [arrowCoords[0], arrowCoords[4]];
    const tailWidthFactor = mathDistance(coord1, coord2) / getBaseLength(coords) / 2;
    const bodyCoords = getArrowBodyCoords(coords, neckLeftCoord, neckRightCoord, tailWidthFactor);
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
  else {
    throw new Error('插值出错');
  }
}
interface GetArrowHeadCoordsOptions {
  headHeightFactor: number;
  headWidthFactor: number;
  neckWidthFactor: number;
  neckHeightFactor: number;
}

/**
 * 插值头部点
 * @param coords
 */
function getArrowHeadCoords(coords: CoordArray[], options: GetArrowHeadCoordsOptions): CoordArray[] {
  const { headHeightFactor, headWidthFactor, neckWidthFactor, neckHeightFactor } = options;

  const len = getBaseLength(coords);
  const headHeight = len * headHeightFactor;
  const headCoord = coords.at(-1)!;
  const headWidth = headHeight * headWidthFactor;
  const neckWidth = headHeight * neckWidthFactor;
  const neckHeight = headHeight * neckHeightFactor;
  const headEndCoord = getThirdCoord(coords.at(-2)!, headCoord, 0, headHeight, true);
  const neckEndCoord = getThirdCoord(coords.at(-2)!, headCoord, 0, neckHeight, true);
  const headLeft = getThirdCoord(headCoord, headEndCoord, HALF_PI, headWidth, false);
  const headRight = getThirdCoord(headCoord, headEndCoord, HALF_PI, headWidth, true);
  const neckLeft = getThirdCoord(headCoord, neckEndCoord, HALF_PI, neckWidth, false);
  const neckRight = getThirdCoord(headCoord, neckEndCoord, HALF_PI, neckWidth, true);
  return [neckLeft, headLeft, headCoord, headRight, neckRight];
}

/**
 * 插值面部分数据
 * @param coords
 * @param neckLeft
 * @param neckRight
 * @param tailWidthFactor
 */
function getArrowBodyCoords(
  coords: CoordArray[],
  neckLeft: CoordArray,
  neckRight: CoordArray,
  tailWidthFactor: number,
): CoordArray[] {
  const allLen = wholeDistance(coords);
  const len = getBaseLength(coords);
  const tailWidth = len * tailWidthFactor;
  const neckWidth = mathDistance(neckLeft, neckRight);
  const widthDif = (tailWidth - neckWidth) / 2;
  let tempLen = 0;
  const leftBodyCoords: CoordArray[] = [];
  const rightBodyCoords: CoordArray[] = [];
  for (let i = 1; i < coords.length - 1; i++) {
    const angle = getAngleOfThreeCoords(coords[i - 1], coords[i], coords[i + 1]) / 2;
    tempLen += mathDistance(coords[i - 1], coords[i]);
    const w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
    const left = getThirdCoord(coords[i - 1], coords[i], Math.PI - angle, w, true);
    const right = getThirdCoord(coords[i - 1], coords[i], angle, w, false);
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
function getTempCoord4(lineCoord1: CoordArray, lineCoord2: CoordArray, coord: CoordArray): CoordArray {
  const midCoord = mid(lineCoord1, lineCoord2);
  const len = mathDistance(midCoord, coord);
  const angle = getAngleOfThreeCoords(lineCoord1, midCoord, coord);
  if (angle < HALF_PI) {
    const distance1 = len * Math.sin(angle);
    const distance2 = len * Math.cos(angle);
    const mid = getThirdCoord(lineCoord1, midCoord, HALF_PI, distance1, false);
    return getThirdCoord(midCoord, mid, HALF_PI, distance2, true);
  }
  else if (angle >= HALF_PI && angle < Math.PI) {
    const distance1 = len * Math.sin(Math.PI - angle);
    const distance2 = len * Math.cos(Math.PI - angle);
    const mid = getThirdCoord(lineCoord1, midCoord, HALF_PI, distance1, false);
    return getThirdCoord(midCoord, mid, HALF_PI, distance2, false);
  }
  else if (angle >= Math.PI && angle < Math.PI * 1.5) {
    const distance1 = len * Math.sin(angle - Math.PI);
    const distance2 = len * Math.cos(angle - Math.PI);
    const mid = getThirdCoord(lineCoord1, midCoord, HALF_PI, distance1, true);
    return getThirdCoord(midCoord, mid, HALF_PI, distance2, true);
  }
  else {
    const distance1 = len * Math.sin(Math.PI * 2 - angle);
    const distance2 = len * Math.cos(Math.PI * 2 - angle);
    const mid = getThirdCoord(lineCoord1, midCoord, HALF_PI, distance1, true);
    return getThirdCoord(midCoord, mid, HALF_PI, distance2, false);
  }
}
