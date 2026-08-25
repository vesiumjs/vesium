---
subText: 深度拾取元素
---

# useSceneDrillPick

响应式封装 [Cesium.Scene.drillPick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#drillPick)：根据屏幕坐标穿透拾取重叠的全部对象，返回结果数组的响应式引用。适用于重叠图形需要“先拾取、再从列表选择目标”的场景；与仅取最上层的 `useScenePick` 互补。

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useSceneDrillPick, useScreenSpaceEventHandler } from 'vesium';
import { shallowRef } from 'vue';

const cursorPosition = shallowRef<Cesium.Cartesian2>();
useScreenSpaceEventHandler(Cesium.ScreenSpaceEventType.MOUSE_MOVE, (m) => {
  cursorPosition.value = m.endPosition.clone();
});
const picks = useSceneDrillPick(cursorPosition, { limit: 10 }); // 最多 10 个，可降低开销
picks.value?.forEach((item, index) => {
  console.log(`${index + 1}.`, item.id.name);
});
```

## 配置项

- `isActive` - 是否激活拾取，默认 `true`；为 `false` 时结果重置为 `undefined`，支持 ref/getter。
- `throttled` - 坐标变化的节流采样间隔（毫秒），默认 `8`。
- `limit` - 最多收集的结果数量，透传给 `scene.drillPick`；不传返回全部命中对象，传较小值可降低开销。
- `width` / `height` - 拾取矩形宽高，默认 `3`。

## 返回值

- 返回 `ComputedRef<any[] | undefined>`：拾取结果数组，元素含 `id`、`primitive` 等字段（对应 `scene.drillPick` 返回项）；无命中或条件不满足时为 `undefined`。

## 注意事项

- `drillPick` 单次开销大于 `pick`，请配合 `throttled` 节流和 `limit` 限制数量。
- viewer 不存在、位置为空或 `isActive` 为 `false` 时，结果重置为 `undefined`。

## Type Definitions

:::dts ./index.ts
:::
