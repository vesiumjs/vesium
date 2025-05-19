# useSceneDrillPick

Uses the [Cesium.Scene.drillPick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#drillPick) function to perform screen point picking, return a computed property containing the pick result, or undefined if no object is picked.

## Usage

```ts
const windowPosition = shallowRef(new Cesium.Cartesian2());
const picks = useSceneDrillPick(windowPosition, { /** options */ });
```

## Type Definitions

:::dts ./index.ts
