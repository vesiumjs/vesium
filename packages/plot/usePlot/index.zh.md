---
sort: 1
subText: 会话编排
---

# usePlot

用于管理 Cesium 标绘会话的组合式函数，是创建、恢复或移除标绘的入口。它维护响应式的标绘列表、共享时间轴、当前激活的标绘以及取消和清理等生命周期处理，渲染和交互由 `PlotScheme` 和 `PlotSkeleton` 驱动。

## Usage

:::demo src="./demo.vue"
:::

## 返回值

### `plots`

当前会话所有标绘的响应式快照（`ComputedRef<PlotFeature[]>`）。

### `time`

会话共享的时间轴（`ShallowRef<JulianDate | undefined>`），可用 `usePlot({ time })` 传入外部时间轴。

### `operate`

新建或恢复 `PlotFeature`（`(plot: PlotFeature | PlotFeatureConstructorOptions) => Promise<PlotFeature>`），完成定义后 resolve，取消或移除时 reject；开始新标绘前会先尝试强制完成上一个定义中的标绘（无法完成则删除该标绘并使其 reject）。

### `remove`

从会话中移除标绘，返回是否成功；移除定义中的标绘时中止其挂起的 `operate()`。

### `cancel`

中止当前挂起的 `operate()` 调用，其返回的 Promise 将 reject。
