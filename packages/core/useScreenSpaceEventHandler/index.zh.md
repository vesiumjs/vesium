---
text: useScreenSpaceEventHandler
subText: 屏幕空间事件
---

# useScreenSpaceEventHandler

轻松使用`ScreenSpaceEventHandler`，当依赖数据发生变化或组件被卸载时，监听函数会自动重新重载或销毁。

它会在 canvas 或依赖输入发生变化时自动重建处理器，并在组件作用域销毁时主动释放。

## Usage

:::demo src="./demo.vue"
:::

```ts
const { isActive, pause, resume } = useScreenSpaceEventHandler({
  type: Cesium.ScreenSpaceEventType.LEFT_CLICK,
  // modifier: Cesium.KeyboardEventModifier.SHIFT,
  // pause: false,
  inputAction: (ctx) => {
    console.log(ctx);
  }
});
```

## 说明

- 返回值是一个停止函数，调用它会立即停止当前监听并销毁处理器。
- `isActive` 只会暂停监听注册，不会强制重建整个 composable。
- `modifier` 会透传给 Cesium 的键盘修饰键参数。

## Type Definitions

:::dts ./index.ts
