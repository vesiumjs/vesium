# Overview

Cross-package utility helpers and shared Cesium-facing type definitions.

## Exports

### Coordinates

- `toCoord`
- `toCartesian3`
- `toCartographic`
- `canvasCoordToCartesian`
- `cartesianToCanvasCoord`

### Runtime helpers

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

### Cesium helpers

- `arrayDiff`
- `cesiumEquals`
- `isCesiumConstant`
- `pick`
- `property`
- `material`
- `convertDMS`
- `types`

## Usage

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

## Type Definitions

:::dts ./index.ts
