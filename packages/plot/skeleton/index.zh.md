---
sort: 4
text: Skeleton
subText: 交互骨架与控制点
---

# Skeleton

供 `PlotScheme` 使用的交互骨架预设。

骨架本身不会渲染最终图形。

它描述的是 `PlotScheme` 可以挂载的交互能力：控制点出现在哪里、拖动时会发生什么、采样点会怎样被更新。

## 导出

| 导出                | 作用                       |
| ------------------- | -------------------------- |
| `control`           | 可拖拽控制点               |
| `interval`          | 闭合图形的中点骨架         |
| `intervalNonclosed` | 开放图形的中点骨架         |
| `moved`             | 将整个图形作为一个整体拖动 |

## 交互模式

- `control` 适合逐个编辑顶点的场景。
- `interval` 适合闭合图形。拖动中点时，会在相邻顶点之间插入一个新的顶点，并继续编辑这个新点。
- `intervalNonclosed` 是开放图形版本的 `interval`，逻辑相同，但不会把最后一个点和第一个点连起来。
- `moved` 适合整体平移图形，也就是一次拖动带动整个形状一起移动。

## 用法

```ts
const skeletons = [moved, control, interval];
```

```ts
const scheme = new PlotScheme({
  type: 'Polygon',
  skeletons: [moved, control, interval],
});
```

## 类型定义

:::dts ./index.ts
