# usePlot

用于管理 Cesium 标绘会话的组合式函数。

它会维护当前会话中的标绘列表，处理激活中的标绘，并自动串联采样、渲染和骨架交互流程。

## Usage

:::demo src="./demo.vue"
:::

## 返回值

- `plots` - 当前会话中的标绘列表
- `time` - 共享的标绘时间轴
- `operate` - 新建标绘或恢复已有标绘
- `remove` - 从会话中移除一个标绘
- `cancel` - 取消当前正在进行的 `operate()` 调用
