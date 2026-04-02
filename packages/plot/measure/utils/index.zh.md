---
text: measure utils
subText: 测量辅助
sort: 1
---

# measure utils

测距、测面方案使用的几何与数值辅助函数，也可以直接用于自定义标绘流程。

## 示例数据

```ts
import { Cartesian3 } from 'cesium';

const points = [
  Cartesian3.fromDegrees(120.12, 30.12),
  Cartesian3.fromDegrees(120.18, 30.12),
  Cartesian3.fromDegrees(120.15, 30.18),
];
```

## 长度和面积

- `distance(positions, options)` 返回分段长度和总长度。示例：`await distance(points)`。
- `area(positions, options)` 返回多边形面积。示例：`await area(points)`。

## 插值采样

- `lerpArray(options)` 在两个点之间做插值，并可选贴地。示例：`await lerpArray({ start: points[0], end: points[1], count: 10 })`。
- `clampToHeightMostDetailedByTilesetOrTerrain(options)` 先按 3D Tiles 贴地，再回退到地形，最后保留原始点位。示例：`await clampToHeightMostDetailedByTilesetOrTerrain({ scene, positions: points })`。

## 三角剖分

- `tesselate(positions)` 将多边形剖分为 `[p0, p1, p2]` 三元组。示例：`tesselate(points)`。
- `triangleGrid(positions, options)` 生成更密的三角网，并可按地形贴地。示例：`await triangleGrid(points, { density: 20 })`。

## Type Definitions

:::dts ./index.ts
