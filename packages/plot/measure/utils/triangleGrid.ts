import type { Scene, TerrainProvider } from 'cesium';
import { Cartesian3, ClassificationType, PerInstanceColorAppearance, PolygonGeometry, Rectangle } from 'cesium';
import { clampToHeightMostDetailedByTilesetOrTerrain } from './clampToGround';

/**
 * 三角网配置
 */
export interface TriangleGridOptions {
  /**
   * 三角网粒度（点位间隔约为边界Rectangle生成的经纬最大值去除以密度）
   * @defaultValue 10
   */
  density: number;

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
 * 生成三角网返回参数，为三角形三点的数组
 */
export type TriangleGridReturn = Array<[p0: Cartesian3, p1: Cartesian3, p2: Cartesian3]>;

function defaultOptions(original?: TriangleGridOptions): TriangleGridOptions {
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
 * 生成三角网数组
 * @param positions - 边界点数组
 * @param options - 配置项
 */
export async function triangleGrid(
  positions: Cartesian3[],
  options?: TriangleGridOptions,
): Promise<TriangleGridReturn> {
  if (positions.length < 3) {
    throw new Error('positions must >= 3');
  }
  const { density, scene, clampToGround, classificationType, terrainProvider } = defaultOptions(options);

  if (density <= 0) {
    throw new Error('options.density must > 0');
  }

  // 取经纬最大值，根据此最大值计算粒度
  const bbox = Rectangle.fromCartesianArray(positions);
  const vertical = bbox.north - bbox.south;
  const horizontal = bbox.east - bbox.west;
  const max = Math.max(horizontal, vertical);
  const granularity = max / density; // 弧度粒度

  const polygonGeometry = PolygonGeometry.fromPositions({
    positions,
    vertexFormat: PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
    granularity,
  });

  const geometry = PolygonGeometry.createGeometry(polygonGeometry)!;
  const values = geometry.attributes.position!.values as number[];
  if (!geometry || !values) {
    throw new Error('positions无法组成有效的geometry,检查点位是否错误');
  }
  const indices = geometry.indices;

  let cartesian3List: Cartesian3[] = [];
  for (let i = 0; i < indices!.length; i += 3) {
    const a = Cartesian3.unpack(values, indices![i] * 3, new Cartesian3());
    const b = Cartesian3.unpack(values, indices![i + 1] * 3, new Cartesian3());
    const c = Cartesian3.unpack(values, indices![i + 2] * 3, new Cartesian3());
    cartesian3List.push(a, b, c);
  }

  if (clampToGround) {
    if (!scene) {
      throw new Error('scene is required on `clampToGround == true`.');
    }
    const detaileds = await clampToHeightMostDetailedByTilesetOrTerrain({
      scene,
      terrainProvider,
      positions: cartesian3List,
      classificationType,
    });
    cartesian3List = detaileds;
  }
  const grid: TriangleGridReturn = [];
  while (cartesian3List?.length) {
    const [a, b, c] = cartesian3List.splice(0, 3);
    grid.push([a, b, c]);
  }

  return grid;
}
