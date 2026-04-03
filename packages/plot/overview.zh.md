---
sort: 0
subText: 标绘系统结构
---

# Overview

`@vesium/plot` 是 Vesium 的标绘层。

它不会直接去拼装裸 Cesium primitive，而是把一次标绘会话、可复用的标绘定义、交互骨架和测量工具组合成一个可以创建、编辑、恢复和测量的完整工作流。

从职责上看：

- `usePlot` 负责当前标绘会话的状态，包括创建、恢复、清理以及更新调度。
- `scheme` 负责定义“画什么、怎么画、何时完成”，以及当前方案要挂哪些骨架。
- `skeleton` 负责定义用户后续如何编辑这个图形。
- `measure` 负责把测距、测面和贴地采样相关的能力封装成可直接使用的方案与工具。

## 各层关系

| 层级       | 真正负责的内容                                                                   | 常见协作者                                                                         |
| ---------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `usePlot`  | 当前会话的状态：标绘列表、时间轴、`operate()` 的执行过程、恢复、取消和作用域清理 | `PlotScheme`、`PlotSkeleton`、`PlotFeature`、`SampledPlotProperty`、`@vesium/core` |
| `scheme`   | 一个标绘的视觉和逻辑定义：初始实体、持续渲染、完成条件以及挂载的交互骨架         | `@vesium/geometry`、`@vesium/shared`、`skeleton`                                   |
| `skeleton` | 标绘编辑时的交互方式：顶点拖拽、中点插入、整体平移、键盘微调                     | Cesium 场景拾取、坐标转换工具                                                      |
| `measure`  | 面向测距和测面的预设方案，以及它们依赖的低层工具                                 | `scheme`、`skeleton`、`distance`、`area`、`lerpArray`                              |

## 典型流程

```ts
import { PlotSchemePolygon, schemeMeasureDistance, usePlot } from 'vesium';

const { operate } = usePlot();

await operate(PlotSchemePolygon);
await operate(schemeMeasureDistance);
```

1. `usePlot()` 创建或恢复一个标绘会话。
2. `PlotScheme` 描述当前标绘的视觉表现和完成条件。
3. `PlotSkeleton` 提供用户可以拖拽、插入或移动的控制点。
4. 测量工具在需要时计算距离、面积以及贴地后的点位结果。

## 相关包

- `@vesium/core` 提供标绘交互依赖的 viewer 生命周期能力。
- `@vesium/shared` 提供坐标转换、节流和运行时工具。
- `@vesium/geometry` 提供部分方案会用到的多边形和战术箭头几何算法。

## 类型定义

:::dts ./index.ts
