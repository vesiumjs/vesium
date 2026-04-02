---
text: core
subText: Cesium 核心钩子
sort: 0
---

# core

核心包提供 Viewer 生命周期、响应式 Cesium 集合、场景交互钩子和更底层的范围化辅助函数。

## 快速开始

```ts
import { createViewer, useViewer } from '@vesium/core';
import { ref } from 'vue';

const elRef = ref<HTMLElement>();
createViewer(elRef);
const viewer = useViewer();
```

## Viewer 与生命周期

- `createViewer` 用于创建或复用 Cesium Viewer 实例。
- `useViewer` 用于获取注入的 Viewer 实例。
- `toPromiseValue` 将值、getter、Promise 统一归一化成 Promise。

## 响应式集合

- `useEntity`、`useDataSource`、`useImageryLayer`、`usePrimitive` 和 `usePostProcessStage` 会把 Cesium 对象响应式添加到对应集合中。
- `useEntityScope`、`useDataSourceScope`、`useImageryLayerScope`、`usePrimitiveScope` 和 `usePostProcessStageScope` 是这些高层 Hook 背后的底层范围化能力。
- `useCollectionScope` 是这些 scope 帮助函数共用的基础工具。

## 场景与事件

- `useCesiumEventListener` 用于响应式绑定 Cesium 事件监听。
- `useScreenSpaceEventHandler` 用于响应式绑定屏幕空间事件。
- `useGraphicEvent` 用于协调图形的 hover、drag 和 click 行为。
- `useScenePick` 和 `useSceneDrillPick` 用于场景拾取。
- `useCameraState` 用于暴露相机相关状态。

## 界面辅助

- `useCesiumFps` 用于跟踪 Cesium 帧率。
- `useScaleBar` 用于渲染会随相机和容器变化而更新的比例尺。
- `useElementOverlay` 用于把 DOM 覆盖物锚定到世界坐标。

## 共享工具

- `@vesium/shared` 也会被 `@vesium/core` 重新导出，因此这里同样可以直接使用坐标和属性辅助函数。

## Type Definitions

:::dts ./index.ts
