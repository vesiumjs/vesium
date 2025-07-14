import type { CoordArray } from 'vesium';

import { getBezierCoords } from './helper';

/**
 * 曲线旗标
 */
export function flagCurve(coords: CoordArray[]): CoordArray[] {
  const coordlength = coords.length;
  if (coordlength < 2) {
    throw new Error('coords.length must >= 2');
  }
  return calculatePonits(coords);
}

/**
 * 插值点数据
 * @param coords
 */
export function calculatePonits(coords: CoordArray[]): CoordArray[] {
  let components: CoordArray[] = [];
  // 至少需要两个控制点
  if (coords.length > 1) {
    // 取第一个
    const startCoord = coords[0];
    // 取最后一个
    const endCoord = coords.at(-1)!;
    // 上曲线起始点
    const coord1 = startCoord;
    // 上曲线第一控制点
    const coord2 = [
      (endCoord[0] - startCoord[0]) / 4 + startCoord[0],
      (endCoord[1] - startCoord[1]) / 8 + startCoord[1],
    ];
    // 上曲线第二个点
    const coord3 = [(startCoord[0] + endCoord[0]) / 2, startCoord[1]];
    // 上曲线第二控制点
    const coord4 = [
      ((endCoord[0] - startCoord[0]) * 3) / 4 + startCoord[0],
      -(endCoord[1] - startCoord[1]) / 8 + startCoord[1],
    ];
    // 上曲线结束点
    const coord5 = [endCoord[0], startCoord[1]];
    // 下曲线结束点
    const coord6 = [endCoord[0], (startCoord[1] + endCoord[1]) / 2];
    // 下曲线第二控制点
    const coord7 = [
      ((endCoord[0] - startCoord[0]) * 3) / 4 + startCoord[0],
      ((endCoord[1] - startCoord[1]) * 3) / 8 + startCoord[1],
    ];
    // 下曲线第二个点
    const coord8 = [(startCoord[0] + endCoord[0]) / 2, (startCoord[1] + endCoord[1]) / 2];
    // 下曲线第一控制点
    const coord9 = [
      (endCoord[0] - startCoord[0]) / 4 + startCoord[0],
      ((endCoord[1] - startCoord[1]) * 5) / 8 + startCoord[1],
    ];
    // 下曲线起始点
    const coord10 = [startCoord[0], (startCoord[1] + endCoord[1]) / 2];
    // 旗杆底部点
    const coord11: CoordArray = [startCoord[0], endCoord[1]];
    // 计算上曲线
    const curve1 = getBezierCoords([coord1, coord2, coord3, coord4, coord5]);
    // 计算下曲线
    const curve2 = getBezierCoords([coord6, coord7, coord8, coord9, coord10] as CoordArray[]);
    // 合并
    components = curve1.concat(curve2);
    components.push(coord11);
  }
  return components;
}
