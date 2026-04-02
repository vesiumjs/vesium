# Utils

Cesium-focused utility functions, type guards, and property helpers.

## Quick Examples

```ts
import { arrayDiff, throttle, toCartesian3, toCoord } from '@vesium/shared';

const cartesian = toCartesian3([120, 30, 100]);
const coord = toCoord(cartesian, { alt: true });
const diff = arrayDiff([1, 2, 3], [2, 3, 4]);
const save = throttle(() => console.log('tick'));
```

## Coordinate Helpers

- `canvasCoordToCartesian(canvasCoord, scene, mode)` converts canvas coordinates to world coordinates. Example: `canvasCoordToCartesian(canvasPosition, scene)`.
- `cartesianToCanvasCoord(position, scene)` converts world coordinates to canvas coordinates. Example: `cartesianToCanvasCoord(position, scene)`.
- `toCartesian3(position)` converts a common coordinate to `Cartesian3`. Example: `toCartesian3([120, 30, 100])`.
- `toCartographic(position)` converts a common coordinate to `Cartographic`. Example: `toCartographic([120, 30, 100])`.
- `toCoord(position, options)` converts a coordinate to array or object output. Example: `toCoord(position, { alt: true })`.
- `dmsEncode(degrees, precision)` encodes decimal degrees into a DMS string. Example: `dmsEncode(120.5)`.
- `dmsDecode(dmsCode)` decodes a DMS string into decimal degrees. Example: `dmsDecode('120°30′0″E')`.
- `degreesToDms(position, precision)` converts a coordinate to longitude/latitude DMS strings. Example: `degreesToDms([120, 30, 100])`.
- `dmsToDegrees(dms)` converts DMS strings back to decimal degrees. Example: `dmsToDegrees(['120°0′0″E', '30°0′0″N', 100])`.

## Type Guards

- `isDef(val)` checks whether a value is defined. Example: `isDef(value)`.
- `isBoolean(val)` checks whether a value is boolean. Example: `isBoolean(flag)`.
- `isFunction(val)` checks whether a value is a function. Example: `isFunction(callback)`.
- `isNumber(val)` checks whether a value is a number. Example: `isNumber(size)`.
- `isString(val)` checks whether a value is a string. Example: `isString(name)`.
- `isObject(val)` checks whether a value is a plain object. Example: `isObject(options)`.
- `isWindow(val)` checks whether a value is a browser `Window`. Example: `isWindow(window)`.
- `isPromise(val)` checks whether a value looks like a promise. Example: `isPromise(result)`.
- `isElement(val)` checks whether a value is a DOM element. Example: `isElement(el)`.
- `isArray(val)` is the `Array.isArray` alias. Example: `isArray(list)`.
- `isBase64(val)` checks whether a string matches the base64 data-url pattern. Example: `isBase64(src)`.
- `assertError(condition, error)` throws when `condition` is truthy. Example: `assertError(!scene, 'scene is required')`.

## Property Helpers

- `isProperty(value)` checks whether a value is a Cesium property. Example: `isProperty(entity.position)`.
- `toPropertyValue(value, time)` unwraps a property into its raw value. Example: `toPropertyValue(entity.position)`.
- `toProperty(value, isConstant)` wraps a raw value or getter into a Cesium property. Example: `toProperty(() => position)`.
- `createPropertyField(scope, field, maybeProperty, readonly)` defines a Cesium property accessor on a class instance. Example: `createPropertyField(this, 'position', value)`.
- `createCesiumAttribute(scope, key, value, options)` creates a reactive Cesium attribute with change events. Example: `createCesiumAttribute(entity, 'label', label, { toProperty: true })`.
- `createCesiumProperty(scope, key, value, options)` is the property-aware shortcut for `createCesiumAttribute`. Example: `createCesiumProperty(entity, 'position', position)`.

## Cesium Helpers

- `cesiumEquals(left, right)` compares Cesium instances using `equals` when available. Example: `cesiumEquals(a, b)`.
- `isCesiumConstant(value)` checks whether a property is constant. Example: `isCesiumConstant(entity.position)`.
- `CesiumMaterial<U>` is a typed wrapper around Cesium `Material`. Example: `new CesiumMaterial({ fabric: { type: 'Color' } })`.
- `CesiumMaterialProperty<V>` describes a typed material property contract.
- `getMaterialCache(type)` reads a material from Cesium's cache. Example: `getMaterialCache('Color')`.
- `addMaterialCache(type, material)` registers a material in Cesium's cache. Example: `addMaterialCache('MyMaterial', material)`.
- `resolvePick(pick)` flattens `scene.pick` results into a searchable array. Example: `resolvePick(pick)`.
- `pickHitGraphic(pick, graphic)` checks whether a pick hit any graphic in the provided list. Example: `pickHitGraphic(pick, [entity])`.

## Misc

- `arrayDiff(list, oldList)` returns added and removed items between two arrays. Example: `arrayDiff(nextList, prevList)`.
- `throttle(callback, delay, trailing, leading)` creates a throttled callback. Example: `throttle(() => update(), 100)`.
- `tryRun(fn)` wraps a callback and swallows thrown errors after logging them. Example: `tryRun(() => JSON.parse(input))`.

## Type Definitions

:::dts ./arrayDiff.ts

:::dts ./canvasCoordToCartesian.ts

:::dts ./cartesianToCanvasCoord.ts

:::dts ./cesiumEquals.ts

:::dts ./convertDMS.ts

:::dts ./is.ts

:::dts ./isCesiumConstant.ts

:::dts ./material.ts

:::dts ./pick.ts

:::dts ./property.ts

:::dts ./throttle.ts

:::dts ./toCartesian3.ts

:::dts ./toCartographic.ts

:::dts ./toCoord.ts

:::dts ./tryRun.ts

:::dts ./types.ts
