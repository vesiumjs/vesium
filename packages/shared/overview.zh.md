---
subText: 共享工具
---

# Overview

跨包通用的工具函数和 Cesium 相关共享类型。

## 导出

### 坐标转换

- `toCoord`
- `toCartesian3`
- `toCartographic`
- `canvasCoordToCartesian`
- `cartesianToCanvasCoord`

### 运行时工具

- `isDef`
- `isBoolean`
- `isFunction`
- `isNumber`
- `isString`
- `isObject`
- `isWindow`
- `isPromise`
- `isElement`
- `isArray`
- `isBase64`
- `assertError`
- `tryRun`
- `throttle`

### Cesium 工具

- `arrayDiff`
- `cesiumEquals`
- `isCesiumConstant`
- `pick`
- `property`
- `material`
- `convertDMS`
- `types`

## 用法

```ts
const coord = toCoord(position, { type: 'Object', alt: true });
const cartesian = toCartesian3(coord);
const cartographic = toCartographic(coord);
```

```ts
if (isPromise(value)) {
  await value;
}
```

```ts
const diff = arrayDiff(nextList, prevList);
const safeFn = tryRun(() => doSomething());
```

## 类型定义

:::dts ./index.ts
