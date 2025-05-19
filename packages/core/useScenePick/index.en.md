# useScenePick

This is a wrapper for [Cesium.Scene.pick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#pick) that retrieves the first object in the scene containing a `primitive` property using screen coordinates.

## Usage

```ts
const windowPosition = shallowRef(new Cesium.Cartesian2());
const pick = useScenePick(windowPosition, { /** options */ });
```

## Type Definitions

:::dts ./index.ts
