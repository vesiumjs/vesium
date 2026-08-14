---
subText: Shared Utilities
---

# Overview

Cross-package utility helpers and shared Cesium-facing type definitions, built on Cesium and VueUse; reused by the other packages and usable directly in your own code.

## Exports

### Coordinates

Use these when converting between Cesium coordinate systems (`Cartesian3`, `Cartographic`, longitude/latitude arrays or objects).

- `toCoord` — convert coordinates to an array or object in the specified format, with optional type and altitude settings
- `toCartesian3` — convert a position to Cartesian coordinates; accepts multiple coordinate inputs, returns `undefined` for invalid input
- `toCartographic` — convert a position to `Cartographic`; accepts multiple coordinate inputs, returns `undefined` for invalid input
- `canvasCoordToCartesian` — convert canvas coordinates to Cartesian coordinates, with multiple picking modes
- `cartesianToCanvasCoord` — convert Cartesian coordinates to canvas coordinates

### Runtime helpers

Use these for type checks, safe execution, and frequency limiting in everyday runtime code.

- `isDef` — check whether a value is defined
- `isBoolean` — check whether a value is a boolean
- `isFunction` — check whether a value is a function
- `isNumber` — check whether a value is a number
- `isString` — check whether a value is a string
- `isObject` — check whether a value is a plain object
- `isWindow` — check whether a value is the `window` object
- `isPromise` — check whether a value is a Promise
- `isElement` — check whether a value is a DOM element
- `isArray` — check whether a value is an array
- `isBase64` — check whether a string is base64 data
- `assertError` — throw the given error when the condition is truthy
- `tryRun` — safely execute a function, catching errors without throwing
- `throttle` — throttle a function to limit how often it runs

### Cesium helpers

Use these when working with Cesium object equality, properties, materials, and picking results.

- `arrayDiff` — compute the difference between two arrays
- `cesiumEquals` — determine whether two Cesium objects are equal
- `isCesiumConstant` — determine whether a Cesium property is a constant
- `pick` — helpers for analyzing `scene.pick` results
- `property` — Cesium Property helpers
- `material` — Cesium material support
- `convertDMS` — convert between degrees and Degrees-Minutes-Seconds (DMS)
- `types` — shared type definitions

## Usage

```ts
const coord = toCoord(position, { type: 'Object', alt: true });
const cartesian = toCartesian3(coord);
```
