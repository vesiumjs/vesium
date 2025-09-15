import type { Scene, TerrainProvider } from 'cesium';
import { Cartesian3, ClassificationType } from 'cesium';
import { lerpArray } from './lerpArray';

/**
 * 计算多点位之间的距离入参
 */
export interface DistanceOptions {
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
   * @defaultValue 50
   */
  density?: number;
}

/**
 * 计算多点位之间的距离返回参数
 */
export interface DistanceReturn {
  /**
   * 当前点位与下一点位之间的距离（米）
   */
  stages: number[];

  /**
   * 所有点位之间相加的总距离（米）
   */
  count: number;
}

function defaultOptions(original?: DistanceOptions): DistanceOptions {
  const clampToGround = original?.clampToGround ?? false;
  const classificationType = original?.classificationType ?? ClassificationType.BOTH;
  const density = Math.floor(original?.density ?? 50);
  return {
    scene: original?.scene,
    clampToGround,
    classificationType,
    terrainProvider: original?.terrainProvider,
    density,
  };
}

/**
 * 计算多点位之间的距离
 * @param positions
 */
export async function distance(positions: Cartesian3[], options?: DistanceOptions): Promise<DistanceReturn> {
  if (positions.length < 2) {
    throw new Error('positions.length must >= 2');
  }
  const _options = defaultOptions(options);

  const stages: number[] = [];
  let count = 0;
  positions.forEach((position, index) => {
    if (index !== positions.length - 1) {
      const next = positions[index + 1];
      const distance = Cartesian3.distance(position, next);
      stages.push(distance);
      count += distance;
    }
  });

  // 不贴地
  if (!_options.clampToGround) {
    return {
      stages,
      count,
    };
  }

  // 贴地
  const density = _options.density!;
  if (density <= 0) {
    throw new Error('options.density must > 0');
  }

  // 按每段长度占总长度的比例分配插值数量
  const densities = stages.map((stage) => {
    return Math.floor((stage / count) * density);
  });
  // 出现未分配的插值数量则分配给最后一项
  const diff = density - densities.reduce((count, current) => (count += current), 0);
  if (diff) {
    densities[densities.length - 1] += diff;
  }

  const positionListPromises = densities.map((density, i) => {
    return lerpArray({
      scene: _options.scene,
      start: positions[i],
      end: positions[i + 1],
      count: density,
      clampToGround: true,
      classificationType: _options.classificationType,
      terrainProvider: _options.terrainProvider,
    });
  });
  const detaileds = await Promise.all(positionListPromises);

  const stagePromises = detaileds.map(async (positions) => {
    const { count } = await distance(positions);
    return count;
  });

  const groundStages = await Promise.all(stagePromises);

  return {
    stages: groundStages,
    count: groundStages.reduce((count, current) => (count += current), 0),
  };
}
