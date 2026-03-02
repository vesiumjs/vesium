---
subText: 叠加图层
---

# useImageryLayer

用于响应式加载 Cesium `ImageryLayer`。当数据发生变化或组件卸载时，它会自动从集合中移除并销毁图层。

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useImageryLayer } from 'vesium';

// 加载基础实例
const layer = useImageryLayer(singleLayer);

// 异步加载
const asyncLayer = useImageryLayer(async () => await getLayer());

// 加载数组
const layers = useImageryLayer([layer1, layer2]);

const isLoading = ref(true);

// 使用配置项
const activeLayers = useImageryLayer(layers, {
  collection: viewer.imageryLayers, // 目标图层集合，默认使用 useViewer().scene.imageryLayers
  isActive: true, // 是否激活（控制图层是否添加到集合）
  evaluating: isLoading, // 加载状态引用
  destroyOnRemove: true, // 当图层移除时是否自动销毁，默认 true
});
```

## Type Definitions

:::dts ./index.ts
