---
subText: 事件订阅
---

# useCesiumEventListener

以响应式方式订阅 `Cesium.Event` 实例上的事件：依赖数据变化（如 viewer 重建）时自动重新订阅，组件卸载时自动销毁监听。适合订阅 `camera.moveStart`、`scene.postRender` 等任意事件，也支持一次订阅多个。

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useCesiumEventListener, useViewer } from 'vesium';

const viewer = useViewer();

// 事件实例可能未就绪或会变化时，传 getter 自动跟随
useCesiumEventListener(() => viewer.value?.camera.moveEnd, () => {
  console.log('Camera move end');
});

// 支持数组：一次订阅多个事件
useCesiumEventListener(() => [viewer.value?.scene.preRender, viewer.value?.scene.postRender], () => {});
```

:::tip 建议
事件常由实时帧渲染触发，可能造成 Vue 响应式无效刷新，监听函数建议节流。可使用 `@vesium/shared` 的 `throttle` 函数或 VueUse 的 [refThrottled](https://vueuse.org/shared/refThrottled/)。
:::

## 配置项

- `isActive` - 是否激活监听，默认 `true`；为 `false` 时不注册监听，恢复后自动重新订阅，支持 ref/getter 动态控制。

## 返回值

- 返回停止函数（`WatchStopHandle`）：调用即移除当前所有已注册监听；组件卸载时自动调用，无需手动清理。

## 注意事项

- `event` 支持单个或多个（数组）`Cesium.Event`，每项可为 `undefined`、ref 或 getter，依赖变化后自动重新订阅。

## Type Definitions

:::dts ./index.ts
:::
