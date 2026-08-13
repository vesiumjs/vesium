---
subText: 核心组合式函数
---

# 概述

`vesium`（`packages/core`）提供基于 Vue Composition API 的组合式函数，将 Cesium 的生命周期与场景对象桥接到 Vue 响应式系统中。

## 导出

### 视图生命周期

- `createViewer` — 创建并管理 `Cesium.Viewer` 实例
- `useViewer` — 获取 `createViewer` 在当前组件或祖先组件中注入的 `Viewer` 实例

### 事件与拾取

- `useCesiumEventListener` — 订阅 Cesium 事件对象
- `useScreenSpaceEventHandler` — 监听画布屏幕空间事件
- `useGraphicEvent` — 统一的图形点击 / 悬停 / 拖拽事件
- `useScenePick` — 在屏幕位置响应式获取 `scene.pick` 结果
- `useSceneDrillPick` — 穿透重叠对象响应式获取 `scene.drillPick` 结果

### 作用域集合

- `useCollectionScope` — 将集合的添加 / 移除操作限定在组件生命周期内
- `useDataSourceScope` — 数据源集合的作用域管理
- `useEntityScope` — 实体集合的作用域管理
- `useImageryLayerScope` — 影像图层集合的作用域管理
- `usePostProcessStageScope` — 后处理阶段集合的作用域管理
- `usePrimitiveScope` — 图元集合的作用域管理

### 数据源与图形

- `useDataSource` — 加载并管理数据源（如 GeoJSON）
- `useEntity` — 创建并同步 `Entity` 实例
- `useImageryLayer` — 管理影像图层
- `usePrimitive` — 管理图元
- `usePostProcessStage` — 管理后处理阶段

### 相机与界面

- `useCameraState` — 响应式相机状态（航向、俯仰、翻滚、位置）
- `useCesiumFps` — FPS 与帧间隔统计
- `useElementOverlay` — 在场景位置上叠加 HTML 元素
- `useScaleBar` — 带距离文本的比例尺

### 工具

- `toPromiseValue` — 将同步 / 异步值归一化为 Promise
