# useScenePick

This is a wrapper for [Cesium.Scene.pick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#pick) that retrieves the first object in the scene containing a `primitive` property using screen coordinates.

It throttles screen-position updates and caches the last result for the same viewer, position, and pick rectangle size.

## Usage

```ts
const windowPosition = shallowRef(new Cesium.Cartesian2());
const pick = useScenePick(windowPosition, { /** options */ });
```

## Notes

- `width` and `height` are passed to `scene.pick` and are part of the cache key.
- When the viewer, input position, or `isActive` state is missing, the returned ref becomes `undefined`.

## Type Definitions

:::dts ./index.ts
