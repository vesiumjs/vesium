# Utils

Cesium 相关的工具函数、类型守卫和属性辅助方法。

## 快速示例

```ts
import { arrayDiff, throttle, toCartesian3, toCoord } from '@vesium/shared';

const cartesian = toCartesian3([120, 30, 100]);
const coord = toCoord(cartesian, { alt: true });
const diff = arrayDiff([1, 2, 3], [2, 3, 4]);
const save = throttle(() => console.log('tick'));
```

## 坐标转换

- `canvasCoordToCartesian(canvasCoord, scene, mode)` 将画布坐标转换为世界坐标。示例：`canvasCoordToCartesian(canvasPosition, scene)`。
- `cartesianToCanvasCoord(position, scene)` 将世界坐标转换为画布坐标。示例：`cartesianToCanvasCoord(position, scene)`。
- `toCartesian3(position)` 将常见坐标类型转换为 `Cartesian3`。示例：`toCartesian3([120, 30, 100])`。
- `toCartographic(position)` 将常见坐标类型转换为 `Cartographic`。示例：`toCartographic([120, 30, 100])`。
- `toCoord(position, options)` 将坐标转换为数组或对象格式。示例：`toCoord(position, { alt: true })`。
- `dmsEncode(degrees, precision)` 将十进制度转换为度分秒字符串。示例：`dmsEncode(120.5)`。
- `dmsDecode(dmsCode)` 将度分秒字符串解码为十进制度。示例：`dmsDecode('120°30′0″E')`。
- `degreesToDms(position, precision)` 将坐标转换为经纬度度分秒字符串。示例：`degreesToDms([120, 30, 100])`。
- `dmsToDegrees(dms)` 将度分秒字符串转换回十进制度。示例：`dmsToDegrees(['120°0′0″E', '30°0′0″N', 100])`。

## 类型守卫

- `isDef(val)` 检查值是否已定义。示例：`isDef(value)`。
- `isBoolean(val)` 检查值是否为布尔值。示例：`isBoolean(flag)`。
- `isFunction(val)` 检查值是否为函数。示例：`isFunction(callback)`。
- `isNumber(val)` 检查值是否为数字。示例：`isNumber(size)`。
- `isString(val)` 检查值是否为字符串。示例：`isString(name)`。
- `isObject(val)` 检查值是否为普通对象。示例：`isObject(options)`。
- `isWindow(val)` 检查值是否为浏览器 `Window`。示例：`isWindow(window)`。
- `isPromise(val)` 检查值是否看起来像 Promise。示例：`isPromise(result)`。
- `isElement(val)` 检查值是否为 DOM 元素。示例：`isElement(el)`。
- `isArray(val)` 是 `Array.isArray` 的别名。示例：`isArray(list)`。
- `isBase64(val)` 检查字符串是否匹配 base64 data-url 格式。示例：`isBase64(src)`。
- `assertError(condition, error)` 在条件成立时抛出错误。示例：`assertError(!scene, 'scene is required')`。

## 属性辅助

- `isProperty(value)` 检查值是否为 Cesium Property。示例：`isProperty(entity.position)`。
- `toPropertyValue(value, time)` 将 Property 解包成原始值。示例：`toPropertyValue(entity.position)`。
- `toProperty(value, isConstant)` 将原始值或 getter 包装为 Cesium Property。示例：`toProperty(() => position)`。
- `createPropertyField(scope, field, maybeProperty, readonly)` 在类实例上定义 Cesium 属性访问器。示例：`createPropertyField(this, 'position', value)`。
- `createCesiumAttribute(scope, key, value, options)` 创建带变化事件的 Cesium 属性。示例：`createCesiumAttribute(entity, 'label', label, { toProperty: true })`。
- `createCesiumProperty(scope, key, value, options)` 是 `createCesiumAttribute` 的属性快捷版。示例：`createCesiumProperty(entity, 'position', position)`。

## Cesium 辅助

- `cesiumEquals(left, right)` 在可能时使用 `equals` 比较 Cesium 实例。示例：`cesiumEquals(a, b)`。
- `isCesiumConstant(value)` 检查属性是否为常量。示例：`isCesiumConstant(entity.position)`。
- `CesiumMaterial<U>` 是带类型的 Cesium `Material` 包装类。示例：`new CesiumMaterial({ fabric: { type: 'Color' } })`。
- `CesiumMaterialProperty<V>` 用于描述带类型的材质属性契约。
- `getMaterialCache(type)` 读取 Cesium 材质缓存。示例：`getMaterialCache('Color')`。
- `addMaterialCache(type, material)` 向 Cesium 材质缓存注册材质。示例：`addMaterialCache('MyMaterial', material)`。
- `resolvePick(pick)` 将 `scene.pick` 结果拍平成可搜索数组。示例：`resolvePick(pick)`。
- `pickHitGraphic(pick, graphic)` 判断拾取结果是否命中图元列表。示例：`pickHitGraphic(pick, [entity])`。

## 其他

- `arrayDiff(list, oldList)` 返回两个数组之间新增和删除的元素。示例：`arrayDiff(nextList, prevList)`。
- `throttle(callback, delay, trailing, leading)` 创建节流函数。示例：`throttle(() => update(), 100)`。
- `tryRun(fn)` 包装函数并在抛错后只记录日志。示例：`tryRun(() => JSON.parse(input))`。

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
