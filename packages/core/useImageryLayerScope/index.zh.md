---
sort: 99
subText: 范围化操作图层
tip: 内部
---

# useImageryLayerScope

将 `ImageryLayerCollection` 的增删操作限定在组件生命周期内：组件卸载时，自动移除所有通过 `add` 添加的影像图层。图层按层级叠加，动态添加的图层若不清理会累积在 `viewer.imageryLayers` 中遮挡底图、占用内存；`add` 支持传入插入索引控制叠加顺序，常见图层加载请优先使用 `useImageryLayer`。

:::warning
这是一个底层辅助函数，用于自定义集合管理。除非你需要自定义集合管理逻辑，否则优先使用高层 API（如 `useImageryLayer`）。
:::

## Usage

```ts
import { ImageryLayer, UrlTemplateImageryProvider } from 'cesium';
import { useImageryLayerScope } from 'vesium';

const { add } = useImageryLayerScope({ destroyOnRemove: true });
// 第二个参数为插入索引：0 表示插入最底层
add(new ImageryLayer(new UrlTemplateImageryProvider({
  url: 'https://example.com/{z}/{x}/{y}.png',
})), 0);
```

## 返回值

- `add(instance, index?)` - 添加图层；`index` 为插入索引，透传给 `imageryLayers.add(layer, index)`；支持 Promise
- `remove(instance, destroy?)` - 移除图层，`destroy` 透传给 `imageryLayers.remove(layer, destroy)`；返回是否移除成功
- `scope` - 已添加图层的只读响应式 `Set`

## 注意事项

- 目标集合默认 `useViewer().value.imageryLayers`；可通过 `collection` 传入自定义 `ImageryLayerCollection`（支持 ref / getter）。
- `destroyOnRemove` 同时作为卸载清理时 `imageryLayers.remove(layer, destroy)` 的第二个参数。

## Type Definitions

:::dts ./index.ts
