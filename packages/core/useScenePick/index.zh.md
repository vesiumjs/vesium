---
subText: 拾取元素
---

# useScenePick

这是 [Cesium.Scene.pick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#pick) 的封装，通过屏幕坐标获取场景中的第一个包含 `primitive` 属性的对象。

## Usage

```ts
const windowPosition = shallowRef(new Cesium.Cartesian2());
const pick = useScenePick(windowPosition, { /** options */ });
```

## Type Definitions

:::dts ./index.ts
