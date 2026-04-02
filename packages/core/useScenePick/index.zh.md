---
subText: 拾取元素
---

# useScenePick

这是 [Cesium.Scene.pick](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#pick) 的封装，通过屏幕坐标获取场景中的第一个包含 `primitive` 属性的对象。

它会节流屏幕坐标变化，并且针对相同的 viewer、位置和拾取矩形大小缓存最近一次结果。

## Usage

```ts
const windowPosition = shallowRef(new Cesium.Cartesian2());
const pick = useScenePick(windowPosition, { /** options */ });
```

## 说明

- `width` 和 `height` 会传给 `scene.pick`，同时也会参与缓存判断。
- 当 viewer、输入位置或 `isActive` 失效时，返回值会被重置为 `undefined`。

## Type Definitions

:::dts ./index.ts
