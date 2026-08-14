# useSceneDrillPick

A reactive wrapper for [Cesium.Scene.drillPick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#drillPick): it picks every object at the same screen coordinates and returns a computed property with the array of results. Use it when the scene contains overlapping graphics or you need a "pick a point, then choose from the list" interaction; unlike `useScenePick`, there is no result cache here.

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
const picks = useSceneDrillPick(cursorPosition, { limit: 10 }); // at most 10, lower cost
picks.value?.forEach((item, index) => {
  console.log(`${index + 1}.`, item.id.name);
});
```

## Options

- `isActive` - Whether picking is active, defaults to `true`; when `false` the result is reset to `undefined`. Supports a ref/getter.
- `throttled` - The throttled sampling interval (ms) for coordinate changes, defaults to `8`.
- `limit` - Stop collecting after this many results, forwarded to `scene.drillPick`; omitted returns every hit object, a smaller value reduces cost.
- `width` / `height` - The width and height of the pick rectangle, defaults to `3`.

## Return Value

- Returns `ComputedRef<any[] | undefined>`: an array of pick results with fields such as `id` and `primitive` (matching each item of `scene.drillPick`); `undefined` when nothing is picked or conditions are not met.

## Notes

- `drillPick` is more expensive than `pick` and has no result cache, so combine it with the `throttled` sampling and a `limit` cap.
- When the viewer is missing, the position is empty, or `isActive` is `false`, the result is reset to `undefined`.

## Type Definitions

:::dts ./index.ts
:::
