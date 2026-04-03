---
sort: 1
subText: 会话编排
---

# usePlot

用于管理 Cesium 标绘会话的组合式函数。

它负责维持当前标绘流程的会话状态，包括响应式的标绘列表、共享时间轴、当前激活的标绘，以及取消和清理等生命周期处理。

在实际使用中，`usePlot()` 是你创建、恢复或移除标绘时的入口，而真正的渲染和交互通常由 `PlotScheme` 和 `PlotSkeleton` 继续驱动。

## Usage

:::demo src="./demo.vue"
:::

## 返回值

- `plots` - 当前会话中的标绘列表
- `time` - 共享的标绘时间轴
- `operate` - 新建标绘或恢复已有标绘
- `remove` - 从会话中移除一个标绘
- `cancel` - 取消当前正在进行的 `operate()` 调用
