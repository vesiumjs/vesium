---
subText: 共享工具
---

# Overview

跨包通用的工具函数和 Cesium 相关共享类型，依赖 Cesium 与 VueUse，其它包（core、geometry、plot 等）都会复用它，也可直接在自己的代码中使用。

## 导出

### 坐标转换

在 Cesium 的坐标体系（`Cartesian3`、`Cartographic`、经纬度数组或对象）之间互相转换时使用。

- `toCoord` — 将坐标转换为指定格式的数组或对象，可选类型与高程配置
- `toCartesian3` — 位置转 Cartesian 坐标，支持多种坐标输入，无效时返回 `undefined`
- `toCartographic` — 位置转 `Cartographic` 坐标，支持多种坐标输入，无效时返回 `undefined`
- `canvasCoordToCartesian` — 画布坐标转 Cartesian 坐标，支持多种拾取模式
- `cartesianToCanvasCoord` — Cartesian 坐标转画布坐标

### 运行时工具

做类型判断、安全执行、频率限制等通用运行时操作时使用。

- `isDef` — 判断值是否已定义
- `isBoolean` — 判断是否为布尔值
- `isFunction` — 判断是否为函数
- `isNumber` — 判断是否为数字
- `isString` — 判断是否为字符串
- `isObject` — 判断是否为普通对象
- `isWindow` — 判断是否为 `window` 对象
- `isPromise` — 判断是否为 Promise
- `isElement` — 判断是否为 DOM 元素
- `isArray` — 判断是否为数组
- `isBase64` — 判断字符串是否为 base64 数据
- `assertError` — 条件为真时抛出传入的错误
- `tryRun` — 安全执行函数，捕获异常不抛出
- `throttle` — 节流函数，限制函数执行频率

### Cesium 工具

处理 Cesium 对象的差异比较、属性、材质与拾取结果时使用。

- `arrayDiff` — 计算两个数组的差异
- `cesiumEquals` — 判断两个 Cesium 对象是否相等
- `isCesiumConstant` — 判断 Cesium 属性是否为常量
- `pick` — `scene.pick` 结果分析工具
- `property` — Cesium Property 工具集
- `material` — Cesium 材质工具集
- `convertDMS` — 度与度分秒（DMS）互转工具
- `types` — 共享类型定义

## 用法

```ts
const coord = toCoord(position, { type: 'Object', alt: true });
const cartesian = toCartesian3(coord);
```
