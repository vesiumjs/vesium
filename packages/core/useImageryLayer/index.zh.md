---
subText: 叠加图层
---

# useImageryLayer

将影像图层 `ImageryLayer` 响应式地加入 `ImageryLayerCollection`（默认 `viewer.imageryLayers`）。多个图层按顺序叠加显示，插入位置 `index` 决定谁盖在谁上面：`useImageryLayer` 用 `index` 控制插入位置、`destroyOnRemove` 控制移除行为，并在数据变化或组件卸载时自动清理上一批图层。注意：显示属性（`alpha`、`brightness`、`splitDirection` 等）在 `ImageryLayer` 实例上设置，hook 只负责集合的增删与顺序。

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useImageryLayer } from 'vesium';

const layer = useImageryLayer(new Cesium.ImageryLayer(
  new Cesium.ArcGisMapServerImageryProvider({ url: '/arcgis/rest/services/...' }),
));

const controlled = useImageryLayer(layer, {
  isActive: true, // false 时从集合移除
  index: 0, // 插入位置：imageryLayers.add(layer, index) 的第二参数
  destroyOnRemove: false, // 反复开关时保留实例，默认会销毁、无法恢复
});
```

## 配置项

- `collection` - 目标 `ImageryLayerCollection`，默认 `useViewer().value.imageryLayers`。
- `isActive` - 是否激活，默认 `true`。
- `evaluating` - 接收异步求值状态的 ref。
- `destroyOnRemove` - 传给 `imageryLayers.remove` 的第二参数；不设默认值（透传 `undefined`），Cesium 按 `true` 处理。
- `index` - 传给 `imageryLayers.add(layer, index)` 的第二参数，即叠加顺序；数组模式下所有图层共用同一 `index`。

## 返回值

- 传入单个值（或 getter/ref/异步 getter）返回 `ComputedRef<T | undefined>`。
- 传入数组返回 `ComputedRef<T[] | undefined>`。

## 注意事项

- 用 `isActive` 反复开关时，若 `destroyOnRemove` 为默认值（`undefined` → Cesium 按 `true`），关闭会销毁图层实例，重新开启时无法恢复；需要开关请显式传 `destroyOnRemove: false`。
- 返回值由 `computedAsync` 驱动，初始值为 `[]`——空数组为真值，判断是否存在时不要依赖 truthy 检查。

## Type Definitions

:::dts ./index.ts
:::
