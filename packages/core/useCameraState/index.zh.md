---
subText: 相机状态
---

# useCameraState

响应式获取 `Camera` 的状态（位置、方向、heading/pitch/roll、层级等）。相机由 Cesium 内部渲染循环驱动，直接读 `viewer.camera.position` 不会触发 Vue 更新；本 hook 监听相机事件（默认 `changed`）、节流（默认 8ms）同步为响应式数据并随动画更新，适合绑定到 UI（如坐标面板）或据此驱动其他逻辑。

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useCameraState } from 'vesium';

const { position, heading, pitch, roll, level } = useCameraState();
```

## 配置项

- `camera` - 要监听的相机，默认 `useViewer().value.scene.camera`。
- `event` - 监听的事件：`changed` | `moveStart` | `moveEnd`，默认 `changed`。
- `delay` - 节流延迟（毫秒），默认 `8`。

## 返回值

- `position` - 相机位置（世界坐标，克隆值）。
- `heading` / `pitch` / `roll` - 相机航向角 / 俯仰角 / 翻滚角（弧度）。
- `level` - 相机中心层级（由高度估算）。
- 其余字段（`direction`、`positionCartographic`、`viewRectangle` 等）见下方类型定义。

## 注意事项

- 默认相机来自 `useViewer()`，使用前需先调用 `createViewer`。
- 状态按节流同步（默认 8ms），不保证逐帧精确；返回的向量/坐标是克隆值，修改不影响相机内部状态。
- `positionCartographic` 经纬度为弧度（2D / 哥伦布视图下可能超出合法范围）；`level` 由经验公式估算，非 Cesium 官方 API。

## Type Definitions

:::dts ./index.ts
:::
