---
sort: 2
text: Measure
subText: 测距、测面与贴地工具
---

# Measure

交互式测距和测面积所需的工具与预设方案。

这个模块分成两层：

- 可直接拿来用的测距和测面预设方案
- 可以在自定义测量流程里复用的低层工具函数

预设方案是为了快速接入交互界面，而这些工具函数则是你在做定制化测量时真正会重复使用的核心能力。

## 导出

| 导出                                          | 作用                       |
| --------------------------------------------- | -------------------------- |
| `schemeMeasureDistance`                       | 交互式测距预设方案         |
| `schemeMeasureArea`                           | 交互式测面积预设方案       |
| `distance`                                    | 计算折线长度               |
| `area`                                        | 计算多边形面积             |
| `lerpArray`                                   | 在两个点之间插值           |
| `clampToHeightMostDetailedByTilesetOrTerrain` | 将点位贴到 3D Tiles 或地形 |
| `tesselate`                                   | 将多边形拆成三角形         |
| `triangleGrid`                                | 生成用于面积采样的三角网   |

## 各部分作用

- `schemeMeasureDistance` 会渲染折线、更新分段标签，并在用户继续绘制时同步维护总距离。
- `schemeMeasureArea` 会渲染多边形、更新面积标签，并适配需要中点编辑的闭合图形。
- `distance()` 会返回每一段的长度和累计总长度，方便你在不使用预设方案时直接调用。
- `area()` 会根据笛卡尔点位计算多边形面积，也可以先贴地到 3D Tiles 或地形后再计算。
- `lerpArray()`、`clampToHeightMostDetailedByTilesetOrTerrain()`、`tesselate()`、`triangleGrid()` 都是支撑这些方案的底层工具，也可以单独拿去做自定义流程。

## 用法

```ts
const { operate } = usePlot();

await operate(schemeMeasureDistance);
```

```ts
const distanceResult = await distance(positions, {
  clampToGround: true,
});
```

```ts
const areaResult = await area(positions, {
  clampToGround: true,
});
```

## 类型定义

:::dts ./index.ts
