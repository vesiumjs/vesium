import type { Cartesian3, Scene, TerrainProvider } from 'cesium';
import { Cartographic, ClassificationType, Ellipsoid, sampleTerrainMostDetailed } from 'cesium';

export interface ClampToHeightMostDetailedByTilesetOrTerrainOptions {
  /**
   * 待贴地的点位
   */
  positions: Cartesian3[];

  scene: Scene;

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
 * 将传入的点位列表进行贴地处理,若某个点位获取高程失败则将此进行克隆返回
 * @param options - 配置项
 */
export async function clampToHeightMostDetailedByTilesetOrTerrain(
  options: ClampToHeightMostDetailedByTilesetOrTerrainOptions,
): Promise<Cartesian3[]> {
  const {
    positions,
    scene,
    classificationType = ClassificationType.BOTH,
    terrainProvider = scene.terrainProvider,
  } = options;

  const tileset = [ClassificationType.BOTH, ClassificationType.CESIUM_3D_TILE].includes(classificationType);
  const terrain = [ClassificationType.BOTH, ClassificationType.TERRAIN].includes(classificationType);

  const tilesetPromise = new Promise<Cartesian3[]>((resolve) => {
    if (tileset) {
      scene
        .clampToHeightMostDetailed(positions.map(e => e.clone()))
        .then(resolve)
        .catch((error) => {
          console.warn(error);
          resolve([]);
        });
    }
    else {
      resolve([]);
    }
  });
  const terrainPromise = new Promise<Cartographic[]>((resolve) => {
    if (terrain && terrainProvider) {
      sampleTerrainMostDetailed(
        terrainProvider,
        positions.map(e => Cartographic.fromCartesian(e)),
      )
        .then(e => resolve(e))
        .catch((error) => {
          console.warn(error);
          resolve([]);
        });
    }
    else {
      resolve([]);
    }
  });
  const [tilesetPositions, terrainPositions] = await Promise.all([tilesetPromise, terrainPromise]);
  const resluts: Cartesian3[] = [];

  positions.forEach((item, index) => {
    const position
      = tilesetPositions[index] || terrainPositions[index]
        ? Ellipsoid.WGS84.cartographicToCartesian(terrainPositions[index])
        : item.clone();
    resluts.push(position);
  });

  return resluts;
}
