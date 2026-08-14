---
subText: 核心组合式函数
---

# 概述

`vesium`（`packages/core`）提供基于 Vue Composition API 的组合式函数，把 Cesium 的生命周期与场景对象桥接到 Vue 响应式系统：hook 自动注册和清理 Cesium 对象，组件卸载时自动释放资源，数据变化自动驱动场景更新。

## 导出

### 视图生命周期

需要创建 Viewer 并共享给当前组件及其子孙组件时使用。

- `createViewer` — 创建并管理 `Cesium.Viewer` 实例
- `useViewer` — 获取当前组件或祖先组件注入的 `Viewer` 实例

### 事件与拾取

需要响应鼠标 / 屏幕空间交互或点击拾取场景对象时使用。

- `useCesiumEventListener` — 订阅 Cesium 事件对象，依赖变化或组件卸载时自动重新订阅 / 销毁
- `useScreenSpaceEventHandler` — 监听画布屏幕空间事件，依赖变化或组件卸载时自动重建 / 销毁
- `useGraphicEvent` — 统一的图形点击 / 悬停 / 拖拽事件
- `useScenePick` — 在屏幕位置响应式获取 `scene.pick` 结果
- `useSceneDrillPick` — 穿透重叠对象响应式获取 `scene.drillPick` 结果

### 作用域集合

需要把集合元素的添加 / 移除限定在组件生命周期内时使用。

- `useCollectionScope` — 将集合的添加 / 移除操作限定在组件生命周期内
- `useDataSourceScope` — 数据源集合的作用域管理，卸载时自动移除
- `useEntityScope` — 实体集合的作用域管理，卸载时自动移除 `Entity`
- `useImageryLayerScope` — 影像图层集合的作用域管理，卸载时自动移除 `ImageryLayer`
- `usePostProcessStageScope` — 后处理阶段集合的作用域管理，卸载时自动移除 `PostProcessStage`
- `usePrimitiveScope` — 图元集合的作用域管理，卸载时自动移除并销毁 `Primitive`

### 数据源与图形

需要加载数据源、创建图形对象并随数据变化自动同步到场景时使用。

- `useDataSource` — 加载并管理数据源，激活由 `isActive` 控制
- `useEntity` — 创建并同步 `Entity` 实例，激活由 `isActive` 控制
- `useImageryLayer` — 管理影像图层，激活由 `isActive` 控制
- `usePrimitive` — 管理图元，激活由 `isActive` 控制
- `usePostProcessStage` — 管理后处理阶段，激活由 `isActive` 控制

### 相机与界面

需要跟随相机状态、展示性能或比例尺信息，或在场景位置上叠加 HTML 时使用。

- `useCameraState` — 响应式相机状态（航向、俯仰、翻滚、位置），节流同步
- `useCesiumFps` — FPS 与帧间隔统计
- `useElementOverlay` — 在场景位置上叠加 HTML 元素
- `useScaleBar` — 带距离文本的比例尺

### 工具

- `toPromiseValue` — 将同步 / 异步值归一化为 Promise
