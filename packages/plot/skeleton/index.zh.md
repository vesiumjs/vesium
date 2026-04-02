---
text: skeleton
subText: 控制点行为
sort: 2
---

# skeleton

这些骨架工厂函数定义了 `usePlot` 中可编辑控制点的交互方式。

## 快速开始

```ts
import { PlotScheme, control, interval, moved } from '@vesium/plot';

const scheme = new PlotScheme({
  type: 'Custom',
  skeletons: [moved, control, interval],
  initRender: () => ({ entities: [] }),
});
```

## 函数

- `control()` 渲染可拖拽的蓝色控制点，并在拖拽或方向键微调时更新对应点位。示例：`control()`。
- `interval()` 为闭合图形渲染中点控制柄，拖拽时会插入新点。示例：`interval()`。
- `intervalNonclosed()` 为开放折线渲染中点控制柄，拖拽时会插入新点。示例：`intervalNonclosed()`。
- `moved()` 渲染整体移动控制柄，用于一次性平移整个图形。示例：`moved()`。

## Type Definitions

:::dts ./index.ts
