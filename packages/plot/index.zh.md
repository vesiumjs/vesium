---
text: plot
subText: 标绘工具
sort: 2
---

# plot

基于 `usePlot` 的 Cesium 标绘工具集，包含预置 `scheme`、可复用 `skeleton` 以及测量相关能力。

## 快速开始

```ts
import { PlotSchemePolyline, usePlot } from '@vesium/plot';

const { operate } = usePlot();
operate({ scheme: PlotSchemePolyline });
```

## 模块

- `usePlot` 负责管理标绘会话和生命周期。
- `scheme` 提供点、箭头、面等常用图形的预置标绘方案。
- `skeleton` 提供可复用的控制点交互行为。
- `measure` 提供测距、测面方案和几何辅助函数。

## Type Definitions

:::dts ./index.ts
