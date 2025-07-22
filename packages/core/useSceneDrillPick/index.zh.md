---
subText: 深度拾取元素
---

# useSceneDrillPick

使用 [Cesium.Scene.drillPick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#drillPick) 函数执行屏幕点拾取，返回包含拾取结果的计算属性。

## Usage

```ts
const windowPosition = shallowRef(new Cesium.Cartesian2());
const picks = useSceneDrillPick(windowPosition, { /** options */ });
```

## Type Definitions

:::dts ./index.ts
