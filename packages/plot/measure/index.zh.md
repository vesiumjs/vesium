---
text: measure
subText: 测量工具
sort: 2
---

# measure

基于 `usePlot` 的测量方案，以及位于 `./utils/` 下的几何辅助函数。

## Usage

:::demo src="./demo.vue"
:::

```ts
import { schemeMeasureDistance, usePlot } from '@vesium/plot';

const { operate } = usePlot();
operate({ scheme: schemeMeasureDistance });
```

## 方案

- `schemeMeasureDistance` 用于测量折线长度和每一段的距离。
- `schemeMeasureArea` 用于测量多边形面积，并在中心位置显示动态标签。

## 工具函数

- `distance`、`area`、`lerpArray`、`clampToHeightMostDetailedByTilesetOrTerrain`、`tesselate` 和 `triangleGrid` 都位于 `./utils/`。

## Type Definitions

:::dts ./index.ts
