import type { Scene, TerrainProvider } from 'cesium';
import { Cartesian3, ClassificationType } from 'cesium';

import { tesselate } from './tesselate';
import { triangleGrid } from './triangleGrid';

/**
 * 计算三维坐标系下三角形面积
 * @param p0 - 三角形第一个点
 * @param p1 - 三角形第二个点
 * @param p2 - 三角形第三个点
 */
function triangleArea(p0: Cartesian3, p1: Cartesian3, p2: Cartesian3) {
  const v0 = Cartesian3.subtract(p0, p1, new Cartesian3());
  const v1 = Cartesian3.subtract(p2, p1, new Cartesian3());
  const cross = Cartesian3.cross(v0, v1, v0);
  return Cartesian3.magnitude(cross) * 0.5;
}

export interface AreaOptions {
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

  /**
   * 插值密度
   * @defaultValue 10
   */
  density?: number;
}

function defaultOptions(original?: AreaOptions): AreaOptions {
  const clampToGround = original?.clampToGround ?? false;
  const classificationType = original?.classificationType ?? ClassificationType.BOTH;
  const density = Math.floor(original?.density ?? 10);
  return {
    scene: original?.scene,
    clampToGround,
    classificationType,
    terrainProvider: original?.terrainProvider,
    density,
  };
}

/**
 * 计算三维坐标系下图形面积
 * @param positions - 图形各点的笛卡尔数组
 */
export async function area(positions: Cartesian3[], options?: AreaOptions): Promise<number> {
  if (positions.length < 2) {
    throw new Error('positions.length must >= 2');
  }

  const { density, scene, clampToGround, classificationType, terrainProvider } = defaultOptions(options);
  if (density! <= 0) {
    throw new Error('options.density must > 0');
  }

  if (!clampToGround) {
    const triangles = tesselate(positions);
    return triangles.reduce((count, current) => (count += triangleArea(...current)), 0);
  }

  const triangles = await triangleGrid(positions, {
    density: density!,
    scene,
    clampToGround,
    classificationType,
    terrainProvider,
  });
  return triangles.reduce((count, current) => (count += triangleArea(...current)), 0);
}
