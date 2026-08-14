---
subText: 拾取元素
---

# useScenePick

响应式封装 [Cesium.Scene.pick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#pick)：根据屏幕坐标拾取场景中的第一个对象，结果放入响应式引用。传入坐标（ref/getter）后自动节流执行拾取，相同条件下结果复用缓存；适合鼠标悬停高亮或把结果接入悬浮面板等响应式状态。

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useScenePick, useScreenSpaceEventHandler } from 'vesium';
import { shallowRef } from 'vue';

const cursorPosition = shallowRef<Cesium.Cartesian2>();
useScreenSpaceEventHandler(Cesium.ScreenSpaceEventType.MOUSE_MOVE, (m) => {
  cursorPosition.value = m.endPosition.clone();
});
const pick = useScenePick(cursorPosition);
if (pick.value?.id instanceof Cesium.Entity) {
  console.log(pick.value.id.name);
}
```

## 配置项

- `isActive` - 是否激活拾取，默认 `true`；为 `false` 时结果重置为 `undefined`，支持 ref/getter 动态控制。
- `throttled` - 坐标变化的节流采样间隔（毫秒），默认 `8`。
- `width` / `height` - 拾取矩形宽高，默认 `3`，透传给 `scene.pick` 并参与结果缓存判断。

## 返回值

- 返回 `Readonly<ShallowRef<ScenePickResult | undefined>>`：拾取结果（`id`、`primitive` 等字段对应 `scene.pick`，完整字段见类型定义），未拾取到任何对象时为 `undefined`。

## 注意事项

- 坐标变化先节流（默认 8ms），高频鼠标移动不会每次都触发 `scene.pick`。
- viewer 不存在、位置为空或 `isActive` 为 `false` 时，结果重置为 `undefined`。
- `scene.pick` 抛错时打印错误日志并将结果置为 `undefined`。

## Type Definitions

:::dts ./index.ts
:::
