---
sort: 99
subText: 范围化操作图层
tip: 内部
---

# useImageryLayerScope

将 `ImageryLayerCollection` 的增删操作范围化，并在组件卸载时自动移除创建的图层。

:::warning
这是一个底层辅助函数，主要供 `useImageryLayer` 使用。除非你需要自定义集合管理逻辑，否则优先使用 `useImageryLayer`。
:::

## Usage

```ts
import { ImageryLayer, UrlTemplateImageryProvider } from 'cesium';
import { useImageryLayerScope } from 'vesium';

const { add, remove } = useImageryLayerScope({
  destroyOnRemove: true,
});

const layer = add(new ImageryLayer(new UrlTemplateImageryProvider({
  url: 'https://example.com/{z}/{x}/{y}.png',
})), 0);

// 也支持异步创建
add(Promise.resolve(new ImageryLayer(new UrlTemplateImageryProvider({
  url: 'https://example.com/{z}/{x}/{y}.png',
}))));
```

## 说明

- 目标集合默认使用 `useViewer().value.imageryLayers`。
- `add` 支持传入插入索引。
- `destroyOnRemove` 会透传给 `imageryLayers.remove(layer, destroyOnRemove)`。

## Type Definitions

:::dts ./index.ts
