---
text: useScreenSpaceEventHandler
subText: 屏幕空间事件
---

# useScreenSpaceEventHandler

以响应式方式使用 Cesium 的 `ScreenSpaceEventHandler` 处理鼠标/触摸屏幕事件：canvas 变化时自动重建处理器，事件类型或修饰键变化时自动重新注册监听，组件卸载时自动销毁。适合监听点击、移动、滚轮、双指手势等事件，事件类型可动态变化。

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useScreenSpaceEventHandler } from 'vesium';

const stop = useScreenSpaceEventHandler(
  Cesium.ScreenSpaceEventType.LEFT_CLICK,
  (event) => {
    console.log(event.position); // 定位事件的回调含屏幕坐标 position
  },
  { modifier: Cesium.KeyboardEventModifier.SHIFT }, // 按住 Shift 才触发
);

stop(); // 组件卸载时自动清理，也可手动停止
```

## 配置项

- `type` - 事件类型（`Cesium.ScreenSpaceEventType`），支持 ref/getter 动态变化；回调参数类型随 `type` 推导（点击等定位事件为 `PositionedEvent`、`MOUSE_MOVE` 为 `MotionEvent`、`WHEEL` 为 `number`、双指手势为 `TwoPointEvent` / `TwoPointMotionEvent`）。不传则不注册监听。
- `inputAction` - 监听回调函数；不传则不注册监听。
- `modifier` - 透传给 Cesium 的修饰键；传数组表示需要同时按住多个键。支持 ref/getter 动态变更。
- `isActive` - 是否激活监听，默认 `true`；只暂停/恢复监听注册，不会重建整个 composable。

## 返回值

- 返回停止函数（`WatchStopHandle`）：调用即停止当前监听并销毁处理器；组件卸载时自动调用。

## 注意事项

- 处理器基于 canvas 创建：canvas 变化（如 viewer 重建）时旧实例自动销毁并创建新实例，无需手动处理。

## Type Definitions

:::dts ./index.ts
:::
