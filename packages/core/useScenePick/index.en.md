# useScenePick

A reactive wrapper for [Cesium.Scene.pick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#pick): it picks the first object in the scene at the given screen coordinates and exposes the result as a reactive ref. Pass the coordinates (a ref or getter) and it throttles and picks automatically, caching results for identical conditions; use it for hover highlighting or feeding the result into reactive state such as a floating info panel.

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

## Options

- `isActive` - Whether picking is active, defaults to `true`; when `false` the result is reset to `undefined`. Supports a ref/getter for dynamic control.
- `throttled` - The throttled sampling interval (ms) for coordinate changes, defaults to `8`.
- `width` / `height` - The width and height of the pick rectangle, defaults to `3`, forwarded to `scene.pick` and part of the result cache key.

## Return Value

- Returns `Readonly<ShallowRef<ScenePickResult | undefined>>`: the pick result (fields such as `id` and `primitive` match `scene.pick`, full list in the type definitions); `undefined` when nothing is picked.

## Notes

- Coordinate changes are throttled (8ms by default), so high-frequency mouse movement does not trigger `scene.pick` on every event.
- When the viewer is missing, the position is empty, or `isActive` is `false`, the result is reset to `undefined`.
- If `scene.pick` throws, an error is logged and the result is set to `undefined`.

## Type Definitions

:::dts ./index.ts
:::
