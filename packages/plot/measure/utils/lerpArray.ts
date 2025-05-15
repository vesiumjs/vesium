import type { ClassificationType, Scene, TerrainProvider } from 'cesium';
import { Cartesian3 } from 'cesium';

import { clampToHeightMostDetailedByTilesetOrTerrain } from './clampToGround';

export interface LerpArrayOptions {
  /**
   * 起点
   */
  start: Cartesian3;
  /**
   * 终点
   */
  end: Cartesian3;

  /**
   * 内插值数量
   */
  count: number;

  scene?: Scene;

  /**
   * 是否贴地
   */
  clampToGround?: boolean;

  /**
   * 贴地类型
   * @defaultValue ClassificationType.BOTH
   */
  classificationType?: ClassificationType;

  /**
   * 地形数据
   * @defaultValue scene.terrainProvider
   */
  terrainProvider?: TerrainProvider;
}

/**
 * 在起点和终点间进行插值, 返回的数组包括起点和终点，数组长度为 count+1
 */
export async function lerpArray(options: LerpArrayOptions): Promise<Cartesian3[]> {
  const { start, end, count, scene, clampToGround, classificationType, terrainProvider } = options;
  const result: Cartesian3[] = [];

  for (let i = 0; i < count; i++) {
    const position = Cartesian3.lerp(start, end, 1 / count, new Cartesian3());
    result.push(position);
  }
  result.push(end.clone());
  if (!clampToGround) {
    return result;
  }
  if (!scene) {
    throw new Error('scene is required on `clampToGround == true`.');
  }
  const detaileds = await clampToHeightMostDetailedByTilesetOrTerrain({
    scene,
    terrainProvider,
    positions: result,
    classificationType,
  });

  return detaileds;
}
