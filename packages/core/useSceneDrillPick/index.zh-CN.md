# useSceneDrillPick

使用 [Cesium.Scene.drillPick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#drillPick) 函数执行屏幕点拾取，返回包含拾取结果的计算属性，若未拾取到对象则返回 undefined。

## Usage

```ts
const windowPosition = shallowRef(new Cesium.Cartesian2());
const picks = useSceneDrillPick(windowPosition, { /** options */ });
```

## Type Definitions

:::dts ./index.ts
